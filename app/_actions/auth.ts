'use server'

import {db} from "@/app/_db/db";
import * as schema from "@/app/_db/schema";
import {eq } from "drizzle-orm";
import {auth} from "@/app/auth";

export const authenticate = async (): Promise<{ teamId:string, name: string, image: string, id:string }> => {
    const session = await auth()
    if (!session) {
        throw new Error("Unauthenticated")
    }
    const account = await db.query.accounts.findFirst({
        where: eq(schema.accounts.userId, session.user.id!)
    })
    if (!account) {
        throw new Error("Unauthenticated")
    }
    const team = await db.query.user_slack_teams.findFirst({
        where: eq(schema.user_slack_teams.slackUserId, account.providerAccountId)
    })
    if (!team) {
        throw new Error("Unauthenticated")
    }
    return {
        id: session.user.id,
        name: session.user.name ?? '',
        image: session.user.image ?? '',
        teamId:team.id,
    }
}
