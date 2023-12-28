'use client'

import React, {useState} from "react";
// import { Editor as NovelEditor } from "novel";
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import {useRoom, useSelf} from "@/liveblocks.config";
import LiveblocksProvider from "@liveblocks/yjs";
import {CollaborationCursor} from "@tiptap/extension-collaboration-cursor";
import "@/app/_components/novel/styles/index.css";
import "@/app/_components/novel/styles/prosemirror.css";
import {NovelEditor} from "@/app/_components/novel/ui/editor";
import {OthersViewer} from "@/app/_components/live/OthersViewer";

export const Editor: React.FC = () => {
    const room = useRoom();
    const userInfo = useSelf((me) => me.info);

    const [yDoc, setYDoc] = useState<Y.Doc>();
    const [provider, setProvider] = useState<any>();

    // Set up Liveblocks Yjs provider
    React.useEffect(() => {
        const yDoc = new Y.Doc();
        const yProvider = new LiveblocksProvider(room, yDoc);
        setYDoc(yDoc);
        setProvider(yProvider);

        return () => {
            yDoc?.destroy();
            yProvider?.destroy();
        };
    }, [room]);

    if (!yDoc || !provider) {
        return null;
    }

    return (
        <div className={'flex flex-col items-center sm:p-12'}>
            {/*<OthersViewer />*/}
            <NovelEditor
                completionApi={'/api/generate'}
                disableLocalStorage
                defaultValue={''}
                extensions={
                    [
                        Collaboration.configure({
                            document: yDoc,
                        }),
                        CollaborationCursor.configure({
                            provider: provider,
                            user: {
                                name: userInfo?.name,
                                color: userInfo?.color,
                            },
                        }),
                    ]
                }
            />
        </div>
    );
}
