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
              <div className={'flex flex-row'}>
                  <div className="basis-3/4">
                      <Avatars />
                      <Editor />
                  </div>
                  <div className="basis-1/4">
                      <OthersViewer/>
                  </div>
              </div>
          </ScreenSync>}
        </ClientSideSuspense>
      </RoomProvider>
    </main>
  )
}
