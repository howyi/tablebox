import NextRouteHandlerReceiver from "@/app/api/slack/[...slug]/NextRouteHandlerReceiver";
import {App} from "@slack/bolt";
import {db} from "@/app/_db/db";
import {eq} from "drizzle-orm";
import {tablebox_teams} from "@/app/_db/schema";
import OpenAI from "openai";

export const dynamic = 'force-dynamic' // defaults to force-static

const baseApiPath = process.env.NEXTAUTH_URL + '/api/slack'
const oauthRedirectPath = '/oauth_redirect'
const installPath = '/install'
const eventPath = '/events'
const loginRedirectUri = process.env.NEXTAUTH_URL

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const receiver = new NextRouteHandlerReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET!,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    installerOptions: {
        stateVerification: true,
        userScopes: [
            'users:read',
        ],
        redirectUriPath: oauthRedirectPath
    },
    oauthRedirectPath,
    installPath,
    eventPath,
    scopes: [
        'commands',
        'links:read',
        'reactions:read',
        'channels:history',
        'groups:history',
        'mpim:history',
        'im:history',
        'users:read',
        'links:write',
    ],
    stateSecret: process.env.SLACK_STATE_SECRET,
    installationStore: {
        storeInstallation: async (installation) => {
            const model: typeof tablebox_teams.$inferInsert = {
                id: installation.team?.id!,
                installation
            }
            await db.insert(tablebox_teams).values(model).onDuplicateKeyUpdate({set: model})
        },
        fetchInstallation: async (InstallQuery) => {
            const team = await db.query.tablebox_teams.findFirst({
                where: eq(tablebox_teams.id, InstallQuery.teamId!)
            })
            if (!team || !team.installation) {
                throw new Error('not found')
            }
            return team.installation
        },
    },
    redirectUri: baseApiPath + oauthRedirectPath,
    loginRedirectUri,
})

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    processBeforeResponse: false,
    receiver,
})

app.event('reaction_added', async ({event, say, client, context}) => {
    if (event.reaction != 'teki') {
        return
    }
    const conversations = (await client.conversations.history({
        channel: event.item.channel,
        latest: event.item.ts,
        limit: 1,
        inclusive: true
    })).messages

    if (!conversations || !conversations[0]) {
        return
    }

    const completion = await openai.chat.completions.create({
        messages: [{
            role: "system",
            content: `以下のテキストにぶっきらぼうな相槌をしてください
            ----
            ${conversations[0].text}
            `
        }],
        model: "gpt-3.5-turbo",
    });
    console.log(completion)
    await say(completion.choices[0].message.content ?? '')
})

const handler = await receiver.start()

export {handler as GET, handler as POST}