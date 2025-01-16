import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/server/auth"
import { ThemeProvider } from "@/components/providers/theme-provider"
import NavBar from "@/components/navigation/NavBar"

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
})
export const metadata: Metadata = {
  title: "Ink Sprout",
  description: "Place to sprout you inks",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      {/* // as docs suggests use suppressHydrationWarning for hydration warning */}
      <html lang="en" suppressHydrationWarning>
        <body className={`${roboto.className} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex-grow px-6 md:px-12 max-w-8xl mx-auto">
              <NavBar />
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
