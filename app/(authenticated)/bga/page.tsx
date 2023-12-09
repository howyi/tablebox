'use server'

import React from "react";
import {Notifies} from "@/app/_components/bga/Notifies";
import {AddNotifyForm} from "@/app/_components/bga/AddNotifyForm";
import {WebhookSetting} from "@/app/_components/bga/WebhookSetting";
import {getWebhookSetting} from "@/app/_actions/bga";

export default async function Home() {
    const webhookSetting = await getWebhookSetting();
    return (
        <main className="min-h-screen p-24">
            <div className="z-10 max-w-5xl w-full font-mono text-sm">
                <h3 className={'p-2'}>通知SlackWebhook設定</h3>
                <WebhookSetting webhookUrl={webhookSetting.slackWebhookUrl!}/>
                <h3 className={'pt-10 p-2'}>通知テーブル設定</h3>
                <AddNotifyForm/>
                <Notifies/>
            </div>
        </main>
    )
}
