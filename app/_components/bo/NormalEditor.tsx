'use client'

import React from "react";
import "@/app/_components/novel/styles/index.css";
import "@/app/_components/novel/styles/prosemirror.css";
import {NovelEditor} from "@/app/_components/novel/ui/editor";
import {Editor as EditorClass} from "@tiptap/core";
import {JSONContent} from "@tiptap/react";

type Props = {
    onUpdate: (editor: EditorClass) => Promise<void>
    onDebouncedUpdate: (editor: EditorClass) => Promise<void>
    defaultValue: JSONContent
}

export const NormalEditor: React.FC<Props> = (props) => {
    const onUpdate = async (editor?: EditorClass) => {
        if (!editor) return
        console.log('updated')
        await props.onUpdate(editor)
    }

    const onDebouncedUpdate = async (editor?: EditorClass) => {
        if (!editor) return
        console.log('debounced', editor.getJSON())
        await props.onDebouncedUpdate(editor)
    }

    return (
        <div className={'flex flex-col items-center sm:p-12'}>
            <NovelEditor
                completionApi={'/api/generate'}
                disableLocalStorage
                defaultValue={props.defaultValue}
                debounceDuration={750}
                onDebouncedUpdate={onDebouncedUpdate}
                onUpdate={onUpdate}
                extensions={
                    []
                }
            />
        </div>
    );
}
