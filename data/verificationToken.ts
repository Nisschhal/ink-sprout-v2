import { db } from "@/server"
import { verificationTokens } from "@/server/db/schema"
import { eq } from "drizzle-orm"

/**
 * Retrieves a verification token associated with the provided email address.
 *
 * @param email - The email address for which the verification token is to be retrieved.
 * @returns The verification token if found, otherwise `null`.
 */
export async function getVerificationTokenByEmail(email: string) {
  try {
    const verificationToken = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.email, email))

    return verificationToken[0] || null
  } catch (error) {
    console.error("Error retrieving verification token by email:", error)
    return null
  }
}

/**
 * Retrieves a verification token based on the provided token string.
 *
 * @param token - The unique token string to locate the verification token.
 * @returns The verification token if found, otherwise `null`.
 */
export async function getVerificationTokenByToken(token: string) {
  try {
    const verificationToken = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token))

    return verificationToken[0] || null
  } catch (error) {
    console.error("Error retrieving verification token by token:", error)
    return null
  }
}
