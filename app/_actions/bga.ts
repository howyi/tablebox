'use server'

import {db} from "@/app/_db/db";
import * as schema from "@/app/_db/schema";
import {and, eq } from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {authenticate} from "@/app/_actions/auth";

export const getWebhookSetting = async (): Promise<typeof schema.bga_team_webhook_settings.$inferSelect> => {
    const user = await authenticate()
    const result = await db.query.bga_team_webhook_settings.findFirst({
        where: eq(schema.bga_team_webhook_settings.teamId, user.teamId),
    });
    if (!result) {
        return {
            teamId: user.teamId,
            slackWebhookUrl: '',
        }
    }
    return result;
}

export const updateWebhookUrl = async (formData: FormData) => {
    const user = await authenticate()
    const model: typeof schema.bga_team_webhook_settings.$inferInsert = {
        slackWebhookUrl: formData.get("url") as string,
        teamId: user.teamId,
    }
    await db.insert(schema.bga_team_webhook_settings).values(model).onDuplicateKeyUpdate({ set: model });
    revalidatePath("/");
}

export const fetchNotifies = async (): Promise<typeof schema.bga_team_notify_settings.$inferSelect[]> => {
    const user = await authenticate()
    return db.query.bga_team_notify_settings.findMany({
        where: eq(schema.bga_team_notify_settings.teamId, user.teamId),
    });
}

export const addNotify = async (formData: FormData) => {
    const user = await authenticate()
    const model: typeof schema.bga_team_notify_settings.$inferInsert = {
        tableUrl: formData.get("url") as string,
        teamId: user.teamId,
    }
    await db.insert(schema.bga_team_notify_settings).values(model);
    revalidatePath("/");
}

export const deleteNotify = async (formData: FormData) => {
    const user = await authenticate()
    const notify_id = Number(formData.get("id"))
    await db.delete(schema.bga_team_notify_settings)
        .where(and(eq(schema.bga_team_notify_settings.id, notify_id), eq(schema.bga_team_notify_settings.teamId, user.teamId)))
    revalidatePath("/");
}