"use server"
import { ResetSchema, ResetSchemaType } from "@/types/schemas"
import { getUserByEmail } from "@/data/user"
import { generateResetToken } from "@/lib/tokens"
import { sendResetEmail } from "@/lib/mails"

/**
 * Handles the signup action for a new user.
 *
 * @param {ResetSchemaType} values - The input values for reset, including `email`
 * @returns {Promise<{ error?: string; success?: string }>} - Returns a promise that resolves to an object containing either an `error` message or a `success` message.
 */
export const resetPassword = async (
  values: ResetSchemaType
): Promise<{ error?: string; success?: string }> => {
  // Validate the input
  const validationResuts = ResetSchema.safeParse(values)

  if (!validationResuts.success) {
    return { error: "Invalide fields! 😑" }
  }

  // Validation success - extract validated data
  const { email } = validationResuts.data
  console.log(email)
  // Check for email existence
  const existingUser = await getUserByEmail(email)

  if (!existingUser) {
    return { error: "Email doesn't exist! 😔" }
  }

  // Generate verification token
  const generatedToken = await generateResetToken(email)

  // TODO: Send verification token to email

  await sendResetEmail(generatedToken.email, generatedToken.token)

  return { success: "Reset Link sent to email! 📩" }
}
