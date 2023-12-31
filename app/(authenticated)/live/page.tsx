'use server'

import React from "react";
import {authenticate} from "@/app/_actions/auth";
import {ProvidedCollabEditor} from "@/app/_components/bo/CollabEditor";

export default async function Home() {
  const {teamId} = await authenticate()
  return (
    <main>
      <ProvidedCollabEditor roomId={`${teamId}:bo`} />
    </main>
  )
}
