'use server'

import {db} from "@/app/_db/db";
import * as schema from "@/app/_db/schema";
import {and, eq } from "drizzle-orm";
import {auth} from "@/app/auth";
import {revalidatePath} from "next/cache";
import {authenticate} from "@/app/_actions/auth";

type TodoWithUser = typeof schema.todos.$inferSelect & {
    user?: typeof schema.users.$inferSelect
}
export const fetchTodos = async (): Promise<TodoWithUser[]> => {
    const user = await authenticate()
    // @ts-ignore
    return await db.query.todos.findMany({
        where: eq(schema.todos.slackTeamId, user.teamId),
        with: {
            user: true
        }
    })
}
export const addTodo = async (formData: FormData) => {
    const user = await authenticate()
    const model: typeof schema.todos.$inferInsert = {
        title: formData.get("title") as string,
        slackTeamId: user.teamId,
        createdUserId: user.id,
    }
    await db.insert(schema.todos).values(model);
    revalidatePath("/");
}

export const deleteTodo = async (formData: FormData) => {
    const user = await authenticate()
    const todo_id = Number(formData.get("todo_id"))
    await db.delete(schema.todos)
        .where(and(eq(schema.todos.id, todo_id), eq(schema.todos.slackTeamId, user.teamId)))
    revalidatePath("/");
}