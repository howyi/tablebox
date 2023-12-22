'use server'

import React from "react";
import {Room} from "@/app/_components/live/Room";
import {authenticate} from "@/app/_actions/auth";

export default async function Home() {
  const {teamId} = await authenticate()
  return (
    <main>
      <Room roomId={`${teamId}:live`} />
    </main>
  )
}
