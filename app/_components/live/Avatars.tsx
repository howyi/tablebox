'use client'

import React from "react";
import {useOthers} from "@/liveblocks.config";

export const Avatars: React.FC = () => {
    const others = useOthers();

    return <div className={'w-full'}>
        <div className="justify-center flex -space-x-2 overflow-hidden py-3">
            {others
                .map((other) => (
                    <img
                        key={other.connectionId}
                        className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        src={other.info?.picture!}
                        alt=""
                    />
                ))}
        </div>
    </div>
}
