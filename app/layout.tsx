import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/server/auth"
import { ThemeProvider } from "@/components/providers/theme-provider"
import NavBar from "@/components/navigations/NavBar"
// uploadthing for not showing readiness of state
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { cn } from "@/lib/utils"
import { ourFileRouter } from "./api/uploadthing/core"
// Toaster
import Toasty from "@/components/ui/toaster"
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
        <body className={cn(`${roboto.className}, antialiased `)}>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex-grow px-6 md:px-12 max-w-8xl mx-auto">
              <NavBar />
              <Toasty />
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
