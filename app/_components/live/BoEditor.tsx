'use client'

import React from "react";
import {authenticate} from "@/app/_actions/auth";
import {ProvidedCollabEditor} from "@/app/_components/bo/CollabEditor";
import {defaultEditorContent} from "@/app/_components/novel/ui/editor/default-content";

export const BoEditor: React.FC<{ roomId: string }> = ({roomId}) => {
    return <ProvidedCollabEditor
        roomId={roomId}
        noteId={0}
        pageId={0}
        onUpdate={async (e) => {
        }}
        onDebouncedUpdate={async (e) => {
        }}
        initialValue={defaultEditorContent}
    />
}
