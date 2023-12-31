import React, {Suspense} from "react";
import {Editor} from "@/app/_components/bo/Editor";
import {getPage} from "@/app/_actions/bo/pages";

export default async function Home({ params: {note, page} }: { params: { note: string, page: string } }) {

  return (
    <main>
        <Suspense fallback={<p>loading ...</p>}>
            <EditorSuspense note_slug={note} page_slug={page} />
        </Suspense>
    </main>
  )
}


const EditorSuspense: React.FC<{note_slug: string, page_slug: string}> = async ({note_slug, page_slug}) => {
    const {page, note} = await getPage(note_slug, page_slug);
    return <Editor note={note} page={page} />
}