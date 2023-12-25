import {toast} from "sonner";
import {EditorState, Plugin, PluginKey} from "@tiptap/pm/state";
import {Decoration, DecorationSet, EditorView} from "@tiptap/pm/view";
import {BlobResult} from "@vercel/blob";

const uploadKey = new PluginKey("upload-image");

const UploadImagesPlugin = () =>
    new Plugin({
        key: uploadKey,
        state: {
            init() {
                return DecorationSet.empty;
            },
            apply(tr, set) {
                set = set.map(tr.mapping, tr.doc);
                // See if the transaction adds or removes any placeholders
                // @ts-ignore
                const action = tr.getMeta(this);
                if (action && action.add) {
                    const {id, pos, src} = action.add;

                    const placeholder = document.createElement("div");
                    placeholder.setAttribute("class", "img-placeholder");
                    const image = document.createElement("img");
                    image.setAttribute(
                        "class",
                        "opacity-40 rounded-lg border border-[var(--novel-stone-200)]"
                    );
                    image.src = src;
                    placeholder.appendChild(image);
                    const deco = Decoration.widget(pos + 1, placeholder, {
                        id,
                    });
                    set = set.add(tr.doc, [deco]);
                } else if (action && action.remove) {
                    set = set.remove(
                        set.find(undefined, undefined, (spec) => spec.id == action.remove.id)
                        // set.find(null, null, (spec) => spec.id == action.remove.id)
                    );
                }
                return set;
            },
        },
        props: {
            decorations(state) {
                return this.getState(state);
            },
        },
    });

export default UploadImagesPlugin;

function findPlaceholder(state: EditorState, id: {}) {
    const decos = uploadKey.getState(state);
    const found = decos.find(null, null, (spec: any) => spec.id == id);
    return found.length ? found[0].from : null;
}

const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));

export function startImageUpload(file: File, view: EditorView, pos: number) {
    // check if the file is an image
    if (!file.type.includes("image/")) {
        toast.error("File type not supported.");
        return;

        // check if the file size is less than 20MB
    } else if (file.size / 1024 / 1024 > 20) {
        toast.error("File size too big (max 20MB).");
        return;
    }

    // A fresh object to act as the ID for this upload
    const id = {};

    // Replace the selection with a placeholder
    const tr = view.state.tr;
    if (!tr.selection.empty) tr.deleteSelection();

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        tr.setMeta(uploadKey, {
            add: {
                id,
                pos,
                src: reader.result,
            },
        });
        view.dispatch(tr);
    };

    handleImageUpload(file).then(async (src) => {
        const {schema} = view.state;

        let pos = findPlaceholder(view.state, id);

        const MAX_RETRY = 5;
        for (let i = 0; i < MAX_RETRY; i++) {
            pos = findPlaceholder(view.state, id);
            if (pos != null) break;
            if (i == (MAX_RETRY - 1)) {
                throw new Error('image position not found')
            } else {
                console.error('image position not found retrying...')
                await sleep(100);
            }
        }

        const node = schema.nodes.image.create({src});
        const transaction = view.state.tr
            .replaceWith(pos, pos, node)
            .setMeta(uploadKey, {remove: {id}});
        view.dispatch(transaction);
    });
}

export const handleImageUpload = async (file: File): Promise<string> => {
    console.log('upload', file)

    // TODO アップロードプロセス
    const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
            "content-type": file?.type || "application/octet-stream",
            "x-vercel-filename": file?.name || "image.png",
        },
        body: file,
    })

   const { url } = (await res.json()) as BlobResult;

    // 画像検証
    await new Promise<string>((resolve, reject) => {
        let img = new Image()
        img.onerror = reject
        img.src = url
        img.onload = () => resolve(img.src)
    }).then()

    console.log('file', url)
    return url
};
