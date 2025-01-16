import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import Credentails from "next-auth/providers/credentials"
import { LoginSchema } from "./schemas"
import { getUserByEmail } from "./data/user"
import bcryptjs from "bcryptjs"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"

export default {
  providers: [
    Credentails({
      async authorize(credentials) {
        const validatedFields = await LoginSchema.safeParse(credentials)
        if (validatedFields.success) {
          const { email, password } = validatedFields.data
          const user = await getUserByEmail(email)
          // if logged in with google | github using credential () signin
          if (!user || !user.password) return null

          const passwordMatch = await bcryptjs.compare(password, user.password)
          // if password matched send the user to signIn() callback
          if (passwordMatch) return user
        }
        return null
      },
    }),
    Google,
    Github,
  ],
} satisfies NextAuthConfig
