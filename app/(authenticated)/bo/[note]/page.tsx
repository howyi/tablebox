'use server'

import React from "react";
import {authenticate} from "@/app/_actions/auth";
import {CollabEditor, ProvidedCollabEditor} from "@/app/_components/bo/CollabEditor";
import {Pages} from "@/app/_components/pages";

export default async function Home({ params }: { params: { note: string } }) {
  return (
    <main>
      <Pages note_slug={params.note}/>
    </main>
  )
}
