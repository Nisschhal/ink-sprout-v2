import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
// get the database from the server/index.ts
import { db } from "@/server"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import { getUserById } from "./data/user"

// desctructre and export required functions at once from NextAuth
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db), // set up the adapter
  session: { strategy: "jwt" }, // set up the jwt strategies as well for adapter
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      token.role = existingUser.role
      token.twoFactorEnabled = existingUser.twoFactorEnabled
      token.image = existingUser.image
      return token
    },
    async session({ session, token }) {
      if (!token.sub) return session
      if (!session.user) return session

      session.user.role = token.role
      session.user.twoFactorEnabled = token.twoFactorEnabled
      session.user.image = token.image

      return session
    },
  },
  providers: [
    Google({
      clientId: process.env.GOGGLE_CLIENT_ID!,
      clientSecret: process.env.GOGGLE_CLIENT_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
})
