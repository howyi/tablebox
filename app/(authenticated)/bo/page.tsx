'use server'

import React from "react";
import {authenticate} from "@/app/_actions/auth";
import {Notes} from "@/app/_components/notes";

export default async function Home() {
  const {teamId} = await authenticate()
  return (
    <main>
        <Notes />
    </main>
  )
}
