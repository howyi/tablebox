'use client'

import React from "react";
import {Editor as EditorClass} from "@tiptap/core";
import {boil_notes, boil_pages} from "@/app/_db/schema";
import {JSONContent} from "@tiptap/react";
import {editPage} from "@/app/_actions/bo/pages";
import {ProvidedCollabEditor} from "@/app/_components/bo/CollabEditor";

export const Editor: React.FC<{
    note: typeof boil_notes.$inferSelect
    page: typeof boil_pages.$inferSelect
}> = ({note, page}) => {
    const onInitialized = async (editor: EditorClass) => {
        window.document.title = page.name;
    }

    const onUpdate = async (editor: EditorClass) => {
    }

    const onDebouncedUpdate = async (editor: EditorClass) => {
        const text = editor.getText({blockSeparator: '\n'})
        const {slug, name} = await editPage(
            note.id,
            page.id,
            JSON.stringify(editor.getJSON()),
            text,
        )
        window.document.title = name;
        window.history.pushState('', '', `/bo/${note.slug}/${slug}`)
    }

  return (
    <main>
      <ProvidedCollabEditor
          roomId={`${page.team_id}:bo:${page.note_id}:${page.id}`}
          noteId={page.note_id}
          pageId={page.id}
          onUpdate={onUpdate}
          onDebouncedUpdate={onDebouncedUpdate}
          initialValue={page.body_raw as JSONContent}
          onInitialized={onInitialized}
      />
    </main>
  )
}
