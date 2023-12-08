import { auth } from "../auth"
import {Todos} from "@/app/_components/Todos";
import {LiveBlocksEditor} from "@/app/_components/LiveBlocksEditor";

export default async function Home() {
  const session = await auth()

  return (
    <main className="min-h-screen p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm">
        <a
            href="/api/auth/signout"
            className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >Sign out</a>

        <p>Welcome {session?.user?.name}!</p>
        <LiveBlocksEditor />
        <Todos />
      </div>
    </main>
  )
}
