import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import type {CallbacksOptions, DefaultSession, NextAuthOptions} from "next-auth"
import {getServerSession, Session} from "next-auth"
import SlackProvider, { SlackProfile } from "next-auth/providers/slack";
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import {db} from "@/app/_db/db";
import * as schema from "@/app/_db/schema";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
const callbacks: CallbacksOptions<SlackProfile> = {
    async signIn({ user, account, profile , email, credentials }) {
        const isAllowedToSignIn = true
        if (!isAllowedToSignIn) {
            return false
            // Or you can return a URL to redirect to:
            // return '/unauthorized'
        }
        const isSignUp = user.id === profile?.["https://slack.com/user_id"]
        if (isSignUp) {
            // signup
            await db.insert(schema.user_slack_teams).values({
                id: profile?.["https://slack.com/team_id"]!,
                slackUserId: profile?.["https://slack.com/user_id"]!,
            });
        }
        return true
    },
    async redirect({ url, baseUrl }) {
        return baseUrl
    },
    async session({ session, user, token }) {
        if (session?.user) {
            session.user.id = user.id;
        }
        return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
        return token
    }
}
export const config = {
    adapter: DrizzleAdapter(db),
    providers: [
        SlackProvider<SlackProfile>({
            clientId: process.env.SLACK_CLIENT_ID!,
            clientSecret: process.env.SLACK_CLIENT_SECRET!,
        })
    ], // rest of your config
    callbacks: callbacks as CallbacksOptions,
} satisfies NextAuthOptions

// Use it in server contexts
export async function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
    return await getServerSession(...args, config) as unknown as Session
}
