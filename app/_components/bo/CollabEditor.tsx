'use client'

import React, {useState} from "react";
// import { Editor as NovelEditor } from "novel";
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import {RoomProvider, useOthers, useRoom, useSelf} from "@/liveblocks.config";
import LiveblocksProvider from "@liveblocks/yjs";
import {CollaborationCursor} from "@tiptap/extension-collaboration-cursor";
import "@/app/_components/novel/styles/index.css";
import "@/app/_components/novel/styles/prosemirror.css";
import {NovelEditor} from "@/app/_components/novel/ui/editor";
import {Editor as EditorClass} from "@tiptap/core";
import {ClientSideSuspense} from "@liveblocks/react";
import {enterRoom, getRoomMember, leaveRoom, reloadRoom} from "@/app/_actions/bo/rooms";
import {JSONContent} from "@tiptap/react";

type Props = {
    onUpdate: (editor: EditorClass) => Promise<void>
    onDebouncedUpdate: (editor: EditorClass) => Promise<void>
    roomId: string
    initialValue: JSONContent
}

export const ProvidedCollabEditor: React.FC<Props> = (params) => {
    const [isInitialize, setIsInitialize] = React.useState(false)
    return <RoomProvider id={params.roomId} initialPresence={{
        cursor: null
    }}>
        <ClientSideSuspense fallback="Loading…">
            {() => (<CollabEditor {...params}/>)}
        </ClientSideSuspense>
    </RoomProvider>
}

let initializeChecked = false;

export const CollabEditor: React.FC<Props> = (params) => {
    const room = useRoom();
    const userInfo = useSelf((me) => me.info);

    const [yDoc, setYDoc] = useState<Y.Doc>();
    const [provider, setProvider] = useState<any>();
    const [editor, setEditor] = useState<EditorClass | null>(null)
    const [isSynced, setIsSynced] = useState(false)

    const handleBeforeUnload = async () => {
        await leaveRoom(params.roomId, room.getSelf()?.connectionId!)
    }

    const checkRoomMembers = async () => {
        const roomMembers = await getRoomMember(params.roomId)
        if (room.getOthers().length + 1 != roomMembers) {
            // DB上のルーム人数と不整合が発生しているため、reloadを呼び出し
            console.log('DB上のルーム人数と不整合が発生しているため、reloadを呼び出し', room.getOthers(), roomMembers)
            await reloadRoom(params.roomId)
        }
    }

    // Set up Liveblocks Yjs provider
    React.useEffect(() => {
        const yDoc = new Y.Doc();
        const yProvider = new LiveblocksProvider(room, yDoc);
        setYDoc(yDoc);
        setProvider(yProvider);

        yProvider.on("sync", (syncStatus: boolean) => {
            setIsSynced(syncStatus)
        });

        enterRoom(params.roomId, room.getSelf()?.connectionId!).then()
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            yDoc?.destroy();
            yProvider?.destroy();
        };
    }, [room]);

    React.useEffect(() =>{
        if (editor && isSynced && !initializeChecked) {
            // 同期完了時に一度だけ呼び出される
            console.log('require initialized: updated', editor.getJSON())
            if (editor.getText() == '') {
                // ドキュメントが空のときは初期値を入れ込む
                editor.commands.setContent(params.initialValue)
            }
            checkRoomMembers().then()
            initializeChecked = true
        }
    }, [editor, isSynced])

    if (!yDoc || !provider) {
        return null;
    }

    const onUpdate = async (editor?: EditorClass) => {
        if (!editor) return
        setEditor(editor)
        if (!isSynced) return
        if (!initializeChecked) return
        console.log('updated')
        await params.onUpdate(editor)
    }

    const onDebouncedUpdate = async (editor?: EditorClass) => {
        if (!editor) return
        if (!isSynced) return
        if (!initializeChecked) return
        console.log('debounced')
        await params.onDebouncedUpdate(editor)
    }

    return (
        <div className={'flex flex-col items-center sm:p-12'}>
            {/*<OthersViewer />*/}
            <NovelEditor
                completionApi={'/api/generate'}
                disableLocalStorage
                defaultValue={''}
                debounceDuration={750}
                onDebouncedUpdate={onDebouncedUpdate}
                onUpdate={onUpdate}
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
