'use server'

import {db} from "@/app/_db/db";
import * as schema from "@/app/_db/schema";
import {and, eq } from "drizzle-orm";
import {auth} from "@/app/auth";
import {revalidatePath} from "next/cache";
import {authenticate} from "@/app/_actions/auth";
import {sleep} from "openai/core";

type RoomWithPage = typeof schema.boil_rooms.$inferSelect & {
    page: typeof schema.boil_pages.$inferSelect
}
export const fetchNotes = async (): Promise<(typeof schema.boil_notes.$inferSelect & {rooms: RoomWithPage[]  })[]> => {
    const user = await authenticate()
    return db.query.boil_notes.findMany({
        where: eq(schema.boil_notes.team_id, user.teamId),
        with: {
            rooms: {
                with: {
                    page: true
                }
            }
        }
    });
}
export const addNote = async (formData: FormData) => {
    const user = await authenticate()
    const model: typeof schema.boil_notes.$inferInsert = {
        team_id: user.teamId,
        name: formData.get("slug") as string,
        slug: formData.get("slug") as string,
    }
    await db.insert(schema.boil_notes).values(model);
    revalidatePath("/");
}
export const updateNote = async (formData: FormData) => {
    const user = await authenticate()
    const model: typeof schema.boil_notes.$inferInsert = {
        team_id: user.teamId,
        id: Number(formData.get("note_id")),
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
    }
    await db.update(schema.boil_notes).set(model).where(and(
        eq(schema.boil_notes.team_id, user.teamId),
        eq(schema.boil_notes.id, Number(formData.get("note_id"))),
    ));
    revalidatePath("/");
}

export const deleteNote = async (formData: FormData) => {
    const user = await authenticate()
    const note_id = Number(formData.get("note_id"))

    await db.transaction(async (tx) => {
        await tx.delete(schema.boil_notes)
            .where(
                and(
                    eq(schema.boil_notes.team_id, user.teamId),
                    eq(schema.boil_notes.id, note_id),
                )
            )
        await tx.delete(schema.boil_pages)
            .where(
                and(
                    eq(schema.boil_pages.team_id, user.teamId),
                    eq(schema.boil_pages.note_id, note_id),
                )
            )
    })
    revalidatePath("/");
}