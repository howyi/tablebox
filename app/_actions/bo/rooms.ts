'use server'

import {db} from "@/app/_db/db";
import * as schema from "@/app/_db/schema";
import {and, eq } from "drizzle-orm";
import {authenticate} from "@/app/_actions/auth";
import {Liveblocks} from "@liveblocks/node";

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_API_KEY!,
});

export const enterRoom = async (room_id: string, connection_id: number): Promise<void> => {
    const user = await authenticate()
    console.log( await liveblocks.getActiveUsers(room_id))
    await db.insert(schema.boil_rooms).values({
        team_id: user.teamId,
        note_id: 0,
        page_id: 0,
        room_id: room_id,
        user_id: user.id,
        connection_id: connection_id,
    })
}

export const getRoomMember = async (room_id: string): Promise<number> => {
    const user = await authenticate()
    const roomMembers = await db.query.boil_rooms.findMany({
        where: and(
            eq(schema.boil_rooms.team_id, user.teamId),
            eq(schema.boil_rooms.room_id, room_id),
        ),
    });
    return roomMembers.length
}

export const leaveRoom = async (room_id: string, connection_id: number): Promise<void> => {
    const user = await authenticate()
    await db.delete(schema.boil_rooms)
        .where(
            and(
                eq(schema.boil_rooms.team_id, user.teamId),
                eq(schema.boil_rooms.room_id, room_id),
                eq(schema.boil_rooms.user_id, user.id),
                eq(schema.boil_rooms.connection_id, connection_id),
            )
        )
    const roomMember = await db.query.boil_rooms.findFirst({
        where: and(
            eq(schema.boil_rooms.team_id, user.teamId),
            eq(schema.boil_rooms.room_id, room_id),
        ),
    });
    if (roomMember) {
        return
    }
    // 全員いなくなった場合はLiveblocksのroomを削除
    await liveblocks.deleteRoom(room_id)
}

// Liveblocksのルーム情報をDBに再反映する
// 1人Roomのとき、getActiveUsersは0を返すので注意すること
export const reloadRoom = async (room_id: string): Promise<void> => {
    const user = await authenticate()
    const res = await liveblocks.getActiveUsers(room_id)
    const newModels: typeof schema.boil_rooms.$inferInsert[] = []
    // @ts-ignore
    for (let uElement of res?.data) {
        newModels.push({
            team_id: user.teamId,
            note_id: 0,
            page_id: 0,
            room_id: room_id,
            user_id: uElement.id,
            connection_id: uElement.connectionId,
        })
    }
    await db.transaction(async (tx) => {
        await tx.delete(schema.boil_rooms)
            .where(
                and(
                    eq(schema.boil_rooms.team_id, user.teamId),
                    eq(schema.boil_rooms.room_id, room_id),
                )
            )
        if (newModels.length > 0) {
            await tx.insert(schema.boil_rooms).values(newModels)
        }
    })
}