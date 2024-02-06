import NextRouteHandlerReceiver from "@/app/api/slack/[...slug]/NextRouteHandlerReceiver";
import {App} from "@slack/bolt";
import {db} from "@/app/_db/db";
import {eq} from "drizzle-orm";
import {slack_teams} from "@/app/_db/schema";
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
        'chat:write',
        'chat:write.public',
        'chat:write.customize',
],
    stateSecret: process.env.SLACK_STATE_SECRET,
    installationStore: {
        storeInstallation: async (installation) => {
            const model: typeof slack_teams.$inferInsert = {
                id: installation.team?.id!,
                installation
            }
            await db.insert(slack_teams).values(model).onDuplicateKeyUpdate({set: model})
        },
        fetchInstallation: async (InstallQuery) => {
            const team = await db.query.slack_teams.findFirst({
                where: eq(slack_teams.id, InstallQuery.teamId!)
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
    if (event.reaction != 'm_koutei' && event.reaction != 'm_hitei' && event.reaction != 'm_tekitou') {
        return
    }
    if (context.retryNum) {
        // リトライによる再送は無視する
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

    let prompt = ''
    switch (event.reaction) {
        case('m_koutei'):
            prompt = '以下のテキストに友人のように肯定的な返信をしてください'
            break;
        case('m_hitei'):
            prompt = '以下のテキストに友人のように否定的な返信をしてください'
            break;
        case('m_tekitou'):
            prompt = '以下のテキストにぶっきらぼうな相槌をしてください'
            break;
    }

    const completion = await openai.chat.completions.create({
        messages: [{
            role: "system",
            content: `${prompt}
            ----
            ${conversations[0].text}
            `
        }],
        model: "gpt-3.5-turbo",
    });
    await client.chat.postMessage({
        channel: event.item.channel,
        username: '返答メカ',
        icon_emoji: `:${event.reaction}:`,
        text: completion.choices[0].message.content ?? ''
    })
})

app.event("app_mention", async ({ event, client, say, context }) => {
    if (context.retryNum) {
        // リトライによる再送は無視する
        return
    }

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "あなたは有能なアシスタントです。"
            },
            {
                role: "user",
                content: event.text,
            }
        ],
        model: "gpt-3.5-turbo",
    });

    await say({
        channel: event.channel,
        username: '返答メカ',
        icon_emoji: `:robot_face:`,
        text: completion.choices[0].message.content ?? ''
    })
})

const handler = await receiver.start()

export {handler as GET, handler as POST}