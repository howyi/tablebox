'use client'

import {useMyPresence, useOthers, useRoom, useSelf} from "@/liveblocks.config";
import React from "react";
import {Cursor} from "@/app/_components/live/Cursor";

export const ScreenSync: React.FC<{children: React.ReactNode}> = (props) => {
    const [myPresence, updateMyPresence] = useMyPresence();
    const others = useOthers();
    const handlePointerMove = (e: any) => {
        const cursor = { x: Math.floor(e.clientX), y: Math.floor(e.clientY) };
        updateMyPresence({ cursor });
    };
    const handlePointerLeave = (e: any) => {
        updateMyPresence({ cursor: null });
    };
    return <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={"h-screen w-screen"}
    >
        {others
            .filter((other) => other.presence.cursor !== null)
            .map((other) => (
                <Cursor
                    key={other.connectionId}
                    x={other.presence.cursor?.x!}
                    y={other.presence.cursor?.y!}
                    color={other.info?.color! as string}
                    name={other.info?.name! as string}
                    image={other.info?.picture! as string}
                />
            ))}
        {props.children}
    </div>
}
