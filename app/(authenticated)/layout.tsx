import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {auth} from "@/app/auth";
import {redirect} from "next/navigation";
import '../globals.css'
import {NavBar} from "@/app/_components/NavBar";
import {ClientSessionWrapper} from "@/app/_components/ClientSessionWrapper";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'tablebox',
}

// 認証必要のRouteGroups
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientSessionWrapper>
          <NavBar />
        </ClientSessionWrapper>
        {children}
      </body>
    </html>
  )
}
