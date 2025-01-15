// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    // role: "user" | "admin" | null
  }

  interface Session {
    user: DefaultSession["user"] & {
      role: "user" | "admin" | null
      twoFactorEnabled: boolean | null
      image: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "user" | "admin" | null
    twoFactorEnabled: boolean | null
    image: string | null
  }
}
