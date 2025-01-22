import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/server"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { getUserByEmail, getUserById } from "../data/user"
import { accounts, users } from "./db/schema"
import { eq } from "drizzle-orm"
import Credentails from "next-auth/providers/credentials"
import { loginSchema } from "@/types/schemas"
import bcryptjs from "bcryptjs"
import Stripe from "stripe"
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },

  secret: process.env.AUTH_SECRET!,

  events: {
    // Triggered when a new user is created
    // createUser: async ({ user }) => {
    //   // Initialize Stripe with the API secret
    //   const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    //     apiVersion: "2024-12-18.acacia",
    //   })

    //   // Create a new customer in Stripe using the user's email and name
    //   const customer = await stripe.customers.create({
    //     email: user.email!, // Ensure email is provided
    //     name: user.name!, // Ensure name is provided
    //   })

    //   // Update the user's record in the database with the Stripe customer ID
    //   await db
    //     .update(users)
    //     .set({ customerId: customer.id }) // Add Stripe's customer ID
    //     .where(eq(users.id, user.id!)) // Match the user by ID
    // },
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
        if (!token.sub) return token // Return early if no user ID (sub) is present

        // Fetch the user from the database
        const existingUser = await getUserById(token.sub)
        if (!existingUser) return token // Return token if user does not exist

        // Fetch the account associated with the user
        const existingAccount = await db
          .select()
          .from(accounts)
          .where(eq(accounts.userId, existingUser.id))

        // Add additional attributes to the  token
        token.isOAuth = !!existingAccount[0] // Check if the account is OAuth
        token.name = existingUser.name
        token.email = existingUser.email
        token.image = existingUser.image
        token.role = existingUser.role
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

        return token
      } catch (error) {
        console.error("JWT Callback Error:", error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (!token.sub && !session) return session

        // Attach additional attributes
        session.user.id = token.sub!
        session.user.name = token.name
        session.user.email = token.email!
        session.user.isOAuth = token.isOAuth
        session.user.image = token.image
        session.user.role = token.role
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled

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
    // Google OAuth provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!, // Google client ID from environment
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Google client secret
    }),

    // GitHub OAuth provider
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!, // GitHub client ID
      clientSecret: process.env.GITHUB_CLIENT_SECRET!, // GitHub client secret
    }),
  ],
})
