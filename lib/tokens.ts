// generate token

import { v4 as uuidv4 } from "uuid"

import crpyto from "crypto"
import { getVerificationTokenByEmail } from "@/data/verificationToken"
import { db } from "@/server"
import { eq } from "drizzle-orm"
import {
  passwordResetTokens,
  twoFactorCode,
  twoFactorConfirmations,
  verificationTokens,
} from "@/server/db/schema"
import { getTwoFactorCodeByEmail } from "@/data/twoFactorToken"
import { getTwoFactorConfirmationByUserId } from "@/data/confirmationToken"

// generate verfication token

/**
 * Creates a new verification token, or replaces existing one
 * @param email - store verificaiton token to given email
 * @returns - retuns created verification token object
 */
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000) // 1 hours time limit

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id))
  }

  const verificationToken = await db
    .insert(verificationTokens)
    .values({
      token,
      expiresAt,
      email,
    })
    .returning()

  return verificationToken[0]
}

// generate reset token

/**
 * Creates a new reset token, or replaces existing one
 * @param email - store reset token to given email
 * @returns - retuns created reset token object
 */
export const generateResetToken = async (email: string) => {
  try {
    const token = uuidv4() // Generate unique token
    const expiresAt = new Date(Date.now() + 3600 * 1000) // Set expiry time (1 hour from now)

    // Create or update the reset token for the email
    const resetToken = await db
      .insert(passwordResetTokens)
      .values({
        email,
        token,
        expiresAt,
      })
      .returning()

    return resetToken[0]
  } catch (error) {
    console.error("Error generating reset token:", error)
    throw new Error("Could not generate reset token.")
  }
}

// generate two factor token

/**
 * Generates Two factor token and save to database
 * @param email - Email to verify token
 * @returns - returns generate two factor Object including: `token, email, expires`
 */
export const generateTwoFactorCode = async (email: string) => {
  const code = crpyto.randomInt(100_000, 1_000_000).toString()

  const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000) // 5 minutes time limit

  const existingToken = await getTwoFactorCodeByEmail(email)

  if (existingToken) {
    await db.delete(twoFactorCode).where(eq(twoFactorCode.id, existingToken.id))
  }

  const twoFactorToken = await db
    .insert(twoFactorCode)
    .values({
      code,
      email,
      expiresAt,
    })
    .returning()

  return twoFactorToken[0]
}

// two factor confirmation

/**
 * Generates Two factor confrimation and save to database
 * @param userId - Email to verify token
 * @returns - returns generate two factor Confirmation Object including: `userId`
 */
export const generateTwoFactorConfirmation = async (userId: string) => {
  try {
    const existingConfirmation = await getTwoFactorConfirmationByUserId(userId)

    if (existingConfirmation) {
      await db
        .delete(twoFactorConfirmations)
        .where(eq(twoFactorConfirmations.id, existingConfirmation.id))
    }

    const twoFactorConfirmation = await db
      .insert(twoFactorConfirmations)
      .values({
        userId,
      })
    return twoFactorConfirmation
  } catch (error) {
    console.log("Error while generating two factor confirmation", error)
  }
}
