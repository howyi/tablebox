'use server'

import {db} from "@/app/_db/db";
import * as schema from "@/app/_db/schema";
import {and, eq } from "drizzle-orm";
import {auth} from "@/app/auth";
import {revalidatePath} from "next/cache";
import {authenticate} from "@/app/_actions/auth";
import {sleep} from "openai/core";

export const fetchNotes = async (): Promise<typeof schema.boil_notes.$inferSelect[]> => {
    const user = await authenticate()
    return db.query.boil_notes.findMany({
        where: eq(schema.boil_notes.team_id, user.teamId),
    });
}
export const addNote = async (formData: FormData) => {
    const user = await authenticate()
    const model: typeof schema.boil_notes.$inferInsert = {
        team_id: user.teamId,
        slug: formData.get("slug") as string,
    }
    await db.insert(schema.boil_notes).values(model);
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