import { db } from "@/server"
import { passwordResetTokens, verificationTokens } from "@/server/db/schema"
import { eq } from "drizzle-orm"

/**
 * Retrieves a password reset token associated with the provided email address.
 *
 * @param email - The email address for which the password reset token is to be retrieved.
 * @returns The password reset token if found, otherwise `null`.
 */
export async function getPasswordResetTokenByEmail(email: string) {
  try {
    const token = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.email, email))

    return token[0] || null
  } catch (error) {
    console.error("Error retrieving password reset token by email:", error)
    return null
  }
}

/**
 * Retrieves a password reset token based on the provided token string.
 *
 * @param token - The unique token string to locate the password reset token.
 * @returns The password reset token if found, otherwise `null`.
 */
export async function getPasswordResetTokenByToken(token: string) {
  try {
    const passwordResetToken = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))

    return passwordResetToken[0] || null
  } catch (error) {
    console.error("Error retrieving password reset token by token:", error)
    return null
  }
}
/**
 * Retrieves a password reset token based on the provided token string.
 *
 * @param token - The unique token string to locate the password reset token.
 * @returns The password reset token if found, otherwise `null`.
 */
export async function deleteResetTokenById(id: string) {
  try {
    const deletedResetToken = await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, id))
      .returning()

    console.log({ deletedResetToken })
    return deletedResetToken[0] || false
  } catch (error) {
    console.error("Error retrieving password reset token by token:", error)
    return null
  }
}
