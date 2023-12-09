import {db} from "@/app/_db/db";
import {NextRequest, NextResponse} from "next/server";
import {IncomingWebhook, IncomingWebhookSendArguments} from "@slack/webhook";
import {tableUrlParse} from "@/app/api/cron/tableUrlParser";
import {check as sevenwonders} from '@/app/api/cron/sevenwonders';

// cron実行間隔
const NOTIFY_MINUTES = 10;

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

        console.log(parsed)
        let res: IncomingWebhookSendArguments | undefined
        switch (parsed.gameName) {
            case "sevenwonders":
                res = await sevenwonders(NOTIFY_MINUTES, parsed.tableRegion, parsed.tableId)
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

    return NextResponse.json({ });
}