import {db} from "@/app/_db/db";
import {NextRequest, NextResponse} from "next/server";
import {IncomingWebhook, IncomingWebhookSendArguments} from "@slack/webhook";
import {tableUrlParse} from "@/app/api/cron/tableUrlParser";
import {check as sevenwonders} from '@/app/api/cron/sevenwonders';
import * as schema from "@/app/_db/schema";
import {desc} from "drizzle-orm";
import {cron_job_histories} from "@/app/_db/schema";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const code = searchParams.get('code')
    console.log(code)

    if (code != process.env.CRON_VERIFICATION_CODE) {
        return NextResponse.json({
            message: 'verification error'
        }, { status: 401 });
    }

    const notifies = await db.query.bga_team_notify_settings.findMany()
    const webhooks = await db.query.bga_team_webhook_settings.findMany()

    for (let notify of notifies) {
        const webhookSetting = webhooks.find((w) => {
            return w.teamId === notify.teamId
        })

        if (!webhookSetting || !webhookSetting.slackWebhookUrl) {
            continue
        }

        const parsed = tableUrlParse(notify.tableUrl)

        const latestHistory = await db.query.cron_job_histories.findFirst({
            orderBy: [desc(cron_job_histories.id)],
        })
        const checkAfterUnixTime = latestHistory ? Math.floor(latestHistory.executed_at.getTime() / 1000) : 0

        console.log(parsed)
        console.log('checkAfterUnixTime: ', new Date(checkAfterUnixTime * 1000))
        let res: IncomingWebhookSendArguments | undefined
        switch (parsed.gameName) {
            case "sevenwonders":
                res = await sevenwonders(checkAfterUnixTime, parsed.tableRegion, parsed.tableId)
                break
            default:
                break
        }
        if (!res) {
            continue
        }
        const webhook = new IncomingWebhook(webhookSetting.slackWebhookUrl);
        await webhook.send({
            username: "parrot",
            icon_emoji: ":parrot:",
            ...res
        });
    }

    await db.insert(schema.cron_job_histories).values({
        executed_at: new Date()
    })

    return NextResponse.json({ });
}