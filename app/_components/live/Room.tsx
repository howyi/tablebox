'use client'

import React from "react";
import {RoomProvider} from "@/liveblocks.config";
import {ClientSideSuspense} from "@liveblocks/react";
import {ScreenSync} from "@/app/_components/live/ScreenSync";
import {Avatars} from "@/app/_components/live/Avatars";
import {Editor} from "@/app/_components/live/Editor";
import {OthersViewer} from "@/app/_components/live/OthersViewer";

export const Room: React.FC<{roomId: string}> = ({roomId}) => {
    return <RoomProvider id={roomId} initialPresence={{
        cursor: null
    }}>
        <ClientSideSuspense fallback="Loading…">
            {() => <ScreenSync>
                <div className={'flex flex-row'}>
                    <div className="basis-3/4">
                        <Avatars/>
                        <Editor/>
                    </div>
                    <div className="basis-1/4">
                        <OthersViewer/>
                    </div>
                </div>
            </ScreenSync>}
        </ClientSideSuspense>
    </RoomProvider>
}