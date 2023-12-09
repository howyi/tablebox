import { auth } from "../auth"
import {Todos} from "@/app/_components/Todos";

export default async function Home() {
  const session = await auth()

  return (
    <main className="min-h-screen p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm">
        <p>Welcome {session?.user?.name}!</p>
        <Todos />
      </div>
    </main>
  )
}
