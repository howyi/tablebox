import {LANG_MAP} from './lang';
import axios, {AxiosRequestConfig} from "axios";
import {MessageAttachment} from "@slack/types";
import {IncomingWebhookSendArguments} from "@slack/webhook/dist/IncomingWebhook";

type LogResponse = {
    packet_id: string
    packet_type: string
    time: string
    data: RootLog[]
}

type RootLog = {
    uid: string
    type: string
} & Log

type Log = {
    log: string
    args: {
        [key in string]: string | Log
    } & {
        "i18n": string[]
    }
}

type HistoryResponse = {
    status: number;
    data: {
        valid: number;
        data: LogResponse[]
    }
}

const REPLACE: {[key in string]: string} = {
    "<div class=\"siconmini sicon_S\"></div>": ":sicon_s:",
    "<div class=\"siconmini sicon_C\"></div>": ":sicon_c:",
    "<div class=\"siconmini sicon_G\"></div>": ":sicon_g:",
    "<div class=\"siconmini sicon_L\"></div>": ":sicon_l:",
    "<div class=\"siconmini sicon_O\"></div>": ":sicon_o:",
    "<div class=\"siconmini sicon_P\"></div>": ":sicon_p:",
    "<div class=\"siconmini sicon_W\"></div>": ":sicon_w:",
    "<div class=\"siconmini sicon_mcoin\"></div>": ":sicon_mcoin:",
}

export const check = async (notifyMinutes: Number, tableRegion: Number, tableId: Number): Promise<IncomingWebhookSendArguments | undefined> => {

    const HistoryUrl = `https://ja.boardgamearena.com/${tableRegion}/sevenwonders/sevenwonders/notificationHistory.html`

    const response = await axios.get<string>(
        `https://boardgamearena.com/${tableRegion}/sevenwonders`,
        {params: {table: tableId}}
    )
    if (!response.data) {
        return
    }

    const captured = /requestToken: '(\w+)'/.exec(response.data)
    if (!captured || !captured[1] || !response.headers["set-cookie"]) {
        return
    }
    const requestToken = captured[1]
    const cookie = response.headers["set-cookie"].filter((s) => s.includes("PHPSESSID"))[0]
    if (!cookie) {
        return
    }

    const NotifyLogs: LogResponse[] = []
    let from = 0
    while (true) {
        console.log("from", from)
        const requestConfig: AxiosRequestConfig = {
            params: {
                table: tableId,
                from,
                privateinc: 1,
                history: 1
            },
            headers: {
                Cookie: cookie,
                "x-request-token": requestToken,
            }
        }
        console.log("History Request", HistoryUrl,requestConfig)
        const res = await axios.get<HistoryResponse>(
            HistoryUrl,
            requestConfig
        )
        const data = res?.data?.data?.data
        if (!data) {
            console.error(res.data)
            break
        }
        console.log("History Response", data)
        const date = new Date();
        const now = Math.floor(date.getTime() / 1000)
        const checkAfterTime = now - (notifyMinutes.valueOf() * 60)
        let lastPacketId = from
        for (const resKey in data) {
            const d = data[resKey]
            if (!d) {
                continue
            }
            lastPacketId = Math.max(lastPacketId, Number(d.packet_id))
            if (d.packet_type != 'history') {
                continue
            }
            if (checkAfterTime >= Number(d.time)) {
                continue
            }
            NotifyLogs.push(d)
        }

        if (lastPacketId === from) {
            break
        }
        console.log("lastPacketId", lastPacketId)
        from = lastPacketId + 1
    }

    const attachments: MessageAttachment[] = []

    NotifyLogs.forEach((logResponse) => {
        logResponse.data.forEach((log) => {
            const text = replaceOverwrite(buildText(log))
            attachments.push({
                color: getColor(log.type),
                text,
            })
        })
    })

    if (attachments.length == 0) {
        return
    }

    const link = `https://boardgamearena.com/${tableRegion}/sevenwonders?table=${tableId}`
    attachments.unshift({
        author_name: `7wonders (Table: ${tableId})`,
        author_link: link,
    })

    attachments.push({
        text: link,
    })

    return {
        attachments: attachments,
    }
}

const getColor = (type: string): string => {
    switch (type) {
        case "coinDelta":
            return "#ffdf57"
        case "warVictory":
            return "#ff1b1b"
        case "newAge":
            return "#d3abff"
        default:
            return '#d7d7d7'
    }
}


const replaceOverwrite = (text: string): string => {
    Object.keys(REPLACE).forEach((before) => {
        const after = REPLACE[before]
        text = text.replace(new RegExp(before, 'g'), after)
    })
    return text
}

const buildText = (log: Log): string => {
    if (log.log == "") {
        return ""
    }
    let rawText = log.log
    if (LANG_MAP[rawText]) {
        rawText = LANG_MAP[rawText]
    }
    if (!log.args) {
        return rawText
    }
    Object.keys(log.args).forEach((before) => {
        let after = log.args[before]
        if (typeof after == "object") {
            after = buildText(after)
        }
        if (log.args.i18n && log.args.i18n.includes(before)) {
            if (LANG_MAP[after]) {
                after = LANG_MAP[after]
            }
        }
        const search = "\\\$\{" + before + "\}"
        rawText = rawText.replace(new RegExp(search, 'g'), after)
    })
    return rawText
}