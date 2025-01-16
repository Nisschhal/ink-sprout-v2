import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/server"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import { getUserByEmail, getUserById } from "../data/user"
import { users } from "./db/schema"
import { eq } from "drizzle-orm"
import Credentails from "next-auth/providers/credentials"
import { loginSchema } from "@/types/schemas"
import bcryptjs from "bcryptjs"
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  events: {
    async linkAccount({ user }) {
      if (!user.id) {
        console.error("User ID is undefined in linkAccount.")
        return
      }

      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id))
    },
  },
  callbacks: {
    async jwt({ token }) {
      try {
        if (!token.sub) return token

        const existingUser = await getUserById(token.sub)
        console.log({ existingUser })
        if (!existingUser) return token

        token.role = existingUser.role
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
        token.image = existingUser.image

        return token
      } catch (error) {
        console.error("JWT Callback Error:", error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (!token.sub) return session
        if (!session.user) return session

        session.user.role = token.role
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled
        session.user.image = token.image
        return session
      } catch (error) {
        console.error("Session Callback Error:", error)
        return session
      }
    },
  },
  pages: {
    signIn: "/auth/login",

    error: "/auth/error",
  },
  providers: [
    Credentails({
      async authorize(credentials) {
        try {
          const validatedFields = await loginSchema.safeParse(credentials)
          if (validatedFields.success) {
            const { email, password } = validatedFields.data
            const user = await getUserByEmail(email)
            // if logged in with google | github using credential () signin
            if (!user || !user.password) return null

            const passwordMatch = await bcryptjs.compare(
              password,
              user.password
            )
            // if password matched send the user to signIn() callback
            if (passwordMatch) return user
          }
        } catch (error) {
          console.log(
            "Error while authorizing user in credentials provider!",
            error
          )
        }
        return null
      },
    }),
    Google,
    Github,
  ],
})
