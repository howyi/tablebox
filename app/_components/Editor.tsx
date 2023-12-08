import {useRoom, useSelf} from "@/liveblocks.config";
import * as Y from "yjs";
import LiveblocksProvider from "@liveblocks/yjs";
import {
    $getRoot,
    $createParagraphNode,
    $createTextNode,
    LexicalEditor,
} from "lexical";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {CollaborationPlugin} from "@lexical/react/LexicalCollaborationPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import {Provider} from "@lexical/yjs";
import React from "react";

function initialEditorState(editor: LexicalEditor): void {
    const root = $getRoot();
    const paragraph = $createParagraphNode();
    const text = $createTextNode();
    paragraph.append(text);
    root.append(paragraph);
}

type LiveBlocksUser = { name: string, color: string, picture: string }

export const Editor: React.FC = () => {
    const room = useRoom();
    const userInfo = useSelf<LiveBlocksUser>((me) => me.info as LiveBlocksUser);

    // Lexical config
    const initialConfig = {
        // Don’t set default state, allow CollaborationPlugin to do it instead
        editorState: null,
        namespace: "Demo",
        nodes: [],
        theme: {},
        onError: (error: unknown) => {
            throw error
        },
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <RichTextPlugin
                contentEditable={<ContentEditable/>}
                placeholder={
                    <div>Start typing here…</div>
                }
                ErrorBoundary={LexicalErrorBoundary}
            />
            <CollaborationPlugin
                id="yjs-plugin"
                providerFactory={(id, yDocMap) => {
                    const yDoc = new Y.Doc();
                    yDocMap.set(id, yDoc);
                    return new LiveblocksProvider(room, yDoc) as Provider;
                }}
                initialEditorState={initialEditorState}
                shouldBootstrap={true}
                cursorColor={userInfo.color}
                username={userInfo.name}
            />
        </LexicalComposer>
    );
}
