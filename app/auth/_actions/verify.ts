"use server"
import { getUserByEmail } from "@/data/user"
import { getVerificationTokenByToken } from "@/data/verificationToken"
import { db } from "@/server"
import { users, verificationTokens } from "@/server/db/schema"
import { eq } from "drizzle-orm"

export default async function verifyUser(token: string) {
  try {
    // Get the token by token
    const existinToken = await getVerificationTokenByToken(token)

    if (!existinToken) {
      return { error: "Token doesn't exist! 😐" }
    }

    if (existinToken.expiresAt < new Date()) {
      return { error: "Token has expired! 🙁" }
    }

    // Verify token and set emailVerified
    const existingUser = await getUserByEmail(existinToken.email)

    // if user has already verfied?
    if (!existingUser || existingUser.emailVerified) {
      return { error: "Invalid Token! 🙈" }
    }

    // Delete the token after successful verification
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existinToken.id))

    // Update user to mark email as verified
    await db
      .update(users)
      .set({
        emailVerified: new Date(),
      })
      .where(eq(users.id, existingUser.id))

    return { success: "Email Verified Successfully, please login! 🫡" }
  } catch (error) {
    console.error("Error verifying email token:", error)
    return { error: "Oops Can't something went wrong, try again! 😐" }
  }
}
