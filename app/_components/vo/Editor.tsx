'use client'

import React, {useState} from "react";
import { Editor as NovelEditor } from "novel";
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import {useMyPresence, useRoom, useSelf} from "@/liveblocks.config";
import LiveblocksProvider from "@liveblocks/yjs";
import {StarterKit} from "@tiptap/starter-kit";
import {CollaborationCursor} from "@tiptap/extension-collaboration-cursor";

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
        <div className={'flex flex-col items-center p-4'}>
            {/*<OthersViewer />*/}
            <NovelEditor
                completionApi={'/api/generate'}
                disableLocalStorage
                defaultValue={''}
                extensions={
                    [
                        StarterKit.configure({
                            history: false,
                        }),
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
