'use server'

import React from "react";
import {authenticate} from "@/app/_actions/auth";
import {ProvidedCollabEditor} from "@/app/_components/bo/CollabEditor";
import {defaultEditorContent} from "@/app/_components/novel/ui/editor/default-content";
import {BoEditor} from "@/app/_components/live/BoEditor";

export default async function Home() {
  const {teamId} = await authenticate()
  return (
    <main>
      <BoEditor roomId={`${teamId}:bo`}/>
    </main>
  )
}
