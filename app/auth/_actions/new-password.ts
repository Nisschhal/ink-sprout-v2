"use server"

import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/data/user"
import { NewPasswordSchema, NewPasswordSchemaType } from "@/types/schemas"
import {
  deleteResetTokenById,
  getPasswordResetTokenByToken,
} from "@/data/resetToken"
import { users } from "@/server/db/schema"
import { db } from "@/server"
/**
 * Handles the new password action
 *
 * @param {NewPasswordSchemaType} values - The input values for reset, including `password`
 * @returns {Promise<{ error?: string; success?: string }>} - Returns a promise that resolves to an object containing either an `error` message or a `success` message.
 */
export const changePassword = async (
  values: NewPasswordSchemaType,
  token: string
) => {
  if (!token) {
    return { error: "No Reset Token Provided! 😑" }
  }
  // Validate the input
  const validationResuts = NewPasswordSchema.safeParse(values)

  if (!validationResuts.success) {
    return { error: "Invalid inputs! 😬" }
  }

  // Validation success - extract validated data
  const { password } = validationResuts.data

  // get the reset token
  const resetToken = await getPasswordResetTokenByToken(token)

  if (!resetToken) {
    return { error: "Invalid Reset Token!" }
  }
  if (resetToken.expiresAt < new Date()) {
    return { error: "Token has expired! 🧐" }
  }

  // Check for email existence
  const existingUser = await getUserByEmail(resetToken.email)

  if (!existingUser) {
    return { error: "User doesn't exit! 👀" }
  }

  // Delete reset token
  const isTokenDeleted = await deleteResetTokenById(resetToken.id)

  if (!isTokenDeleted) return { error: "Couldn't reset password! 🙈" }

  // change the password : hash - > update the user's password
  const hashedPassword = await bcrypt.hash(password, 10)

  await db.update(users).set({
    password: hashedPassword,
  })

  return { success: "Password changed Successfully! 🎉" }
}
