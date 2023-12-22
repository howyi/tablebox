'use client'

import React from "react";
import { Editor as NovelEditor } from "novel";

export const Editor: React.FC = () => {

    return (
        <div className={'flex flex-col items-center p-4'}>
            <NovelEditor
                completionApi={'/api/generate'}
            />
        </div>
    );
}
