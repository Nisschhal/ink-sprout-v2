import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/server/auth"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Ink Sprout",
  description: "Place to sprout you inks",
}

export const dynamic = "force-dynamic"

export default async function RootLayout({
  children,
  reuse,
}: Readonly<{
  children: React.ReactNode
  reuse: React.ReactNode
}>) {
  const session = await auth()
  console.log("logged in ", { session })
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          {reuse}
        </body>
      </html>
    </SessionProvider>
  )
}
