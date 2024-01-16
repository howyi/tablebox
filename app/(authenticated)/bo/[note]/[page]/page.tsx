import React, {Suspense} from "react";
import {Editor} from "@/app/_components/bo/Editor";
import {getPage, NoteWithPage} from "@/app/_actions/bo/pages";
import {ArrowRightIcon} from "@heroicons/react/20/solid";

export default async function Home({params}: { params: { note: string, page: string } }) {
    const decodedNoteSlug = decodeURIComponent(params.note)
    const decodedPageSlug = decodeURIComponent(params.page)
    const {page, note} = await getPage(decodedNoteSlug, decodedPageSlug);
  return (
      <main>
          <nav aria-label="breadcrumb" className="mb-4 flex flex-col items-center mt-10">
              <ol className="flex items-center space-x-2">
                  <li>
                      <a className="text-sm text-gray-500" href="/bo">
                          BO
                      </a>
                  </li>
                  <ArrowRightIcon className="w-4 h-4 text-gray-500"/>
                  <li>
                      <a className="text-sm text-gray-500" href={`/bo/${decodedNoteSlug}`}>
                          {decodedNoteSlug}
                      </a>
                  </li>
                  <ArrowRightIcon className="w-4 h-4 text-gray-500"/>
                  <li>
                      <a className="text-sm text-gray-500" href={`/bo/${decodedNoteSlug}/${decodedPageSlug}`}>
                          {page.name}
                      </a>
                  </li>
              </ol>
          </nav>
          <Suspense fallback={<p>loading ...</p>}>
              <EditorSuspense note={note} page={page}/>
          </Suspense>
      </main>
  )
}


export async function EditorSuspense({note, page}: NoteWithPage)  {
    return <Editor note={note} page={page}/>
}