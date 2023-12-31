import React, {Suspense} from "react";
import {Editor} from "@/app/_components/bo/Editor";
import {getPage} from "@/app/_actions/bo/pages";
import {ArrowRightIcon} from "@heroicons/react/20/solid";

export default async function Home({ params: {note, page} }: { params: { note: string, page: string } }) {

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
                      <a className="text-sm text-gray-500" href={`/bo/${note}`}>
                          {note}
                      </a>
                  </li>
                  <ArrowRightIcon className="w-4 h-4 text-gray-500"/>
                  <li>
                      <a className="text-sm text-gray-500" href={`/bo/${note}/${page}`}>
                          {page}
                      </a>
                  </li>
              </ol>
          </nav>
          <Suspense fallback={<p>loading ...</p>}>
              <EditorSuspense note_slug={note} page_slug={page}/>
          </Suspense>
      </main>
  )
}


const EditorSuspense: React.FC<{ note_slug: string, page_slug: string }> = async ({note_slug, page_slug}) => {
    const {page, note} = await getPage(note_slug, page_slug);
    return <Editor note={note} page={page}/>
}