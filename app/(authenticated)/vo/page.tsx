'use server'

import React from "react";
import {authenticate} from "@/app/_actions/auth";
import {Room} from "@/app/_components/vo/Room";

export default async function Home() {
  const {teamId} = await authenticate()
  return (
    <main>
        <Room roomId={`${teamId}:vo`} />
    </main>
  )
}
