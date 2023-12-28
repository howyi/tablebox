'use client'

import React from "react";
import {RoomProvider} from "@/liveblocks.config";
import {ClientSideSuspense} from "@liveblocks/react";
import {Editor} from "@/app/_components/bo/Editor";

export const Room: React.FC<{roomId: string}> = ({roomId}) => {
    return <RoomProvider id={roomId} initialPresence={{
        cursor: null
    }}>
        <ClientSideSuspense fallback="Loading…">
            {() => <Editor />}
        </ClientSideSuspense>
    </RoomProvider>
}