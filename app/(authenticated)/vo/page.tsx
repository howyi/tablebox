'use server'

import React from "react";
import {authenticate} from "@/app/_actions/auth";
import {Editor} from "@/app/_components/vo/Editor";

export default async function Home() {
  const {teamId} = await authenticate()
  return (
    <main>
      <Editor />
    </main>
  )
}
