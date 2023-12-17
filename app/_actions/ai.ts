'use server'

import OpenAI from "openai";
import {auth} from "@/app/auth";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// '以下のテキストに友人のように肯定的な返信をしてください'
// '以下のテキストに友人のように否定的な返信をしてください'
// '以下のテキストにぶっきらぼうな相槌をしてください'
type RESPONSE_TYPE = 'POSITIVE' | 'NEGATIVE' | 'CARELESSLY'

export const generateResponse = async (msg: string): Promise<string> => {
    const session = await auth()
    if (!session) {
        throw new Error("Unauthenticated")
    }
    const completion = await openai.chat.completions.create({
        messages: [{
            role: "system",
            content: `以下のテキストにぶっきらぼうな相槌をしてください
            ----
            ${msg}
            `
        }],
        model: "gpt-3.5-turbo",
    });
    return completion.choices[0].message.content ?? ''
}
