import { Liveblocks } from "@liveblocks/node";
import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/app/auth";
import {authenticate} from "@/app/_actions/auth";

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_API_KEY!,
});

export async function POST(request: NextRequest) {
    const session = await auth()

    if (!session) {
        return NextResponse.json({}, {
            status: 401
        })
    }

    const user = await authenticate()

    // Get the current user's info from your database
    const liveUser = {
        id: session.user.id,
        info: {
            name: session.user.name!,
            color: '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6),
            picture: session.user.image!,
        },
    };

    // Create a session for the current user
    // userInfo is made available in Liveblocks presence hooks, e.g. useOthers
    const liveSession = liveblocks.prepareSession(liveUser.id, {
        userInfo: liveUser.info,
    });

    // Give the user access to the room
    liveSession.allow(`${user.teamId}:*`, liveSession.FULL_ACCESS);

    // Authorize the user and return the result
    const { body, status } = await liveSession.authorize();
    return new Response(body, { status });
}