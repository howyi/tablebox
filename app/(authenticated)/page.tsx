import { auth } from "../auth"
import {Todos} from "@/app/_components/Todos";

export default async function Home() {
  const session = await auth()

  return (
    <main className="min-h-screen p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm">
        <a
            href="/api/auth/signout"
            className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >Sign out</a>
        <a
            href="/live"
            className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-400"
        >/live</a>
        <p>Welcome {session?.user?.name}!</p>
        <Todos />
      </div>
    </main>
  )
}
