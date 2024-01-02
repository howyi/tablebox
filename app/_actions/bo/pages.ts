'use server'

import {db} from "@/app/_db/db";
import * as schema from "@/app/_db/schema";
import {and, eq } from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {authenticate} from "@/app/_actions/auth";
import {INITIAL_PAGE_BODY} from "@/app/_components/bo/CollabEditor";

type NoteWithPages = {
    note: typeof schema.boil_notes.$inferSelect,
    pages: typeof schema.boil_pages.$inferSelect[]
}
export const fetchPages = async (note_slug: string): Promise<NoteWithPages> => {
    const user = await authenticate()
    const note = await db.query.boil_notes.findFirst({
        where: and(
            eq(schema.boil_notes.team_id, user.teamId),
            eq(schema.boil_notes.slug, note_slug),
        ),
    });
    if (!note) {
        throw new Error('not found')
    }
    return {
        note,
        pages: await db.query.boil_pages.findMany({
            where: and(
                eq(schema.boil_pages.team_id, user.teamId),
                eq(schema.boil_pages.note_id, note.id),
            ),
        })
    };
}

type NoteWithPage = {
    note: typeof schema.boil_notes.$inferSelect,
    page: typeof schema.boil_pages.$inferSelect
}
export const getPage = async (note_slug: string, page_slug: string): Promise<NoteWithPage> => {
    const user = await authenticate()
    const note = await db.query.boil_notes.findFirst({
        where: and(
            eq(schema.boil_notes.team_id, user.teamId),
            eq(schema.boil_notes.slug, note_slug),
        ),
    });
    if (!note) {
        throw new Error('note not found')
    }
    const page = await db.query.boil_pages.findFirst({
        where: and(
            eq(schema.boil_pages.team_id, user.teamId),
            eq(schema.boil_pages.note_id, note.id),
            eq(schema.boil_pages.slug, page_slug),
        ),
    });
    if (!page) {
        throw new Error('page not found')
    }
    return {note, page}
}

export const addPage = async (formData: FormData) => {
    const user = await authenticate()
    const note = await db.query.boil_notes.findFirst({
        where: and(
            eq(schema.boil_notes.team_id, user.teamId),
            eq(schema.boil_notes.slug, formData.get("note_slug") as string),
        ),
    });
    if (!note) {
        throw new Error('note not found')
    }
    const model: typeof schema.boil_pages.$inferInsert = {
        team_id: user.teamId,
        slug: formData.get("page_slug") as string,
        note_id: note.id,
        body_raw: {"type": "doc", "content": []},
        body_text: '',
        created_at: new Date(),
        updated_at: new Date(),
    }
    await db.insert(schema.boil_pages).values(model);
    revalidatePath("/");
}
export const editPage = async (
    note_id: number,
    page_id: number,
    body_raw: string,
    body_text: string,
) => {
    const user = await authenticate()

    const page = await db.query.boil_pages.findFirst({
        where: and(
            eq(schema.boil_pages.team_id, user.teamId),
            eq(schema.boil_pages.note_id, note_id),
            eq(schema.boil_pages.id, page_id),
        ),
    });
    if (!page) {
        throw new Error('page not found')
    }

    await db.update(schema.boil_pages)
        .set(
            {
                ...page,
                body_raw: JSON.parse(body_raw),
                body_text,
                updated_at: new Date(),
            }
        ).where(and(
            eq(schema.boil_pages.team_id, user.teamId),
            eq(schema.boil_pages.note_id, note_id),
            eq(schema.boil_pages.id, page_id),
        ))
}

export const deletePage = async (formData: FormData) => {
    const user = await authenticate()
    const note_id = Number(formData.get("note_id"))
    const page_id = Number(formData.get("page_id"))

    await db.delete(schema.boil_pages)
        .where(
            and(
                eq(schema.boil_pages.team_id, user.teamId),
                eq(schema.boil_pages.note_id, note_id),
                eq(schema.boil_pages.id, page_id),
            )
        )
    revalidatePath("/");
}