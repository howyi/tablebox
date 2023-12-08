'use client'

import {Editor} from "@/app/_components/live/Editor";
import React from "react";
import {RoomProvider} from "@/liveblocks.config";
import {ClientSideSuspense} from "@liveblocks/react";
import {ScreenSync} from "@/app/_components/live/ScreenSync";
import {OthersViewer} from "@/app/_components/live/OthersViewer";
import {Avatars} from "@/app/_components/live/Avatars";

export default async function Home() {
  return (
    <main>
      <RoomProvider id="my-room" initialPresence={{
        cursor: null
      }}>
        <ClientSideSuspense fallback="Loading…">
          {() => <ScreenSync>
              <div className={'flex'}>
                  <div className="flex-auto w-128">
                      <Editor />
                  </div>
                  <div className="flex-auto w-16">
                      <Avatars />
                      <OthersViewer/>
                  </div>
              </div>
          </ScreenSync>}
        </ClientSideSuspense>
      </RoomProvider>
    </main>
  )
}
