'use client'

import React from "react";
import {useOthers} from "@/liveblocks.config";

export const OthersViewer: React.FC = () => {
    const others = useOthers();

    return <div className={"bg-slate-900 text-white p-12 text-xs"}>
         <pre className={"whitespace-pre-wrap break-all"}>
             {JSON.stringify(others, null, 2)}
         </pre>
    </div>
}
