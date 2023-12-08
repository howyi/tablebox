'use client'

import React from "react";
import {useOthers, UserMeta, useSelf} from "@/liveblocks.config";

export const Avatars: React.FC = () => {
    const others = useOthers();
    const userInfo = useSelf((me) => me.info);

    return <div className={'w-full'}>
        <div className="justify-center flex -space-x-2 overflow-hidden py-3">
            <div className={"mr-12"}>
                <AvatarIcon user={userInfo}/>
            </div>
            {others
                .map((other) => (
                    <div key={other.connectionId}>
                        <AvatarIcon user={other.info}/>
                    </div>
                ))}
        </div>
    </div>
}

const AvatarIcon: React.FC<{ user: UserMeta['info'] }> = ({user}) => {
    return <img
        className={"inline-block h-10 w-10 rounded-full"}
        style={{
            boxShadow: 'var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) ' + user?.color
        }}
        src={user?.picture!}
        alt=""
    />
}
