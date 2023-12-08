'use client'

import React from "react";
import {RoomProvider} from "@/liveblocks.config";
import {ClientSideSuspense} from "@liveblocks/react";
import {Editor} from "@/app/_components/Editor";

export const LiveBlocksEditor: React.FC = () => {
    return <RoomProvider id="my-room" initialPresence={{}}>
        <ClientSideSuspense fallback="Loading…">
            {() => <Editor />}
        </ClientSideSuspense>
    </RoomProvider>
}
