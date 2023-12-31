import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import {auth} from "@/app/auth";
import {NextResponse} from "next/server";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
// NextAuthがv4ではedgeでの動作に対応していないので無効化 https://github.com/nextauthjs/next-auth/discussions/5855
// export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
    const session = await auth()

    if (!session) {
        return NextResponse.json({}, {
            status: 401
        })
    }


    // Check if the OPENAI_API_KEY is set, if not return 400
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
        return new Response(
            "Missing OPENAI_API_KEY – make sure to add it to your .env file.",
            {
                status: 400,
            },
        );
    }
    if (
        process.env.NODE_ENV != "development" &&
        process.env.KV_REST_API_URL &&
        process.env.KV_REST_API_TOKEN
    ) {
        const ip = req.headers.get("x-forwarded-for");
        const ratelimit = new Ratelimit({
            redis: kv,
            limiter: Ratelimit.slidingWindow(50, "1 d"),
        });

        const { success, limit, reset, remaining } = await ratelimit.limit(
            `novel_ratelimit_${ip}`,
        );

        if (!success) {
            return new Response("You have reached your request limit for the day.", {
                status: 429,
                headers: {
                    "X-RateLimit-Limit": limit.toString(),
                    "X-RateLimit-Remaining": remaining.toString(),
                    "X-RateLimit-Reset": reset.toString(),
                },
            });
        }
    }

    let { prompt } = await req.json();

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content:
                    "あなたはAIライティング・アシスタントです。" +
                    "最初の文よりも後半の文をより重視してください。" +
                    "回答は200文字以内に収め、完全な文章を構成するようにしてください。",
                // we're disabling markdown for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
                // "Use Markdown formatting when appropriate.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
        n: 1,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
}