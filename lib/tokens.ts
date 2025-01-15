// generate token

import { v4 as uuidv4 } from "uuid"

import crpyto from "crypto"
import { getVerificationTokenByEmail } from "@/data/verificationToken"
import { db } from "@/server"
import { eq } from "drizzle-orm"
import { verificationTokens } from "@/server/db/schema"

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

  const verificationToken = await db.insert(verificationTokens).values({
    token,
    expiresAt,
    email,
  })

  return verificationToken
}

// generate reset token

// /**
//  * Creates a new reset token, or replaces existing one
//  * @param email - store reset token to given email
//  * @returns - retuns created reset token object
//  */
// export const generateResetToken = async (email: string) => {
//   try {
//     const token = uuidv4() // Generate unique token
//     const expires = new Date(Date.now() + 3600 * 1000) // Set expiry time (1 hour from now)

//     // Create or update the reset token for the email
//     const resetToken = await db.restPasswordToken.create({
//       data: {
//         email,
//         token,
//         expires,
//       },
//     })

//     return resetToken
//   } catch (error) {
//     console.error("Error generating reset token:", error)
//     throw new Error("Could not generate reset token.")
//   }
// }

// generate two factor token

/**
 * Generates Two factor token and save to database
 * @param email - Email to verify token
 * @returns - returns generate two factor Object including: `token, email, expires`
 */
// export const generateTwoFactorToken = async (email: string) => {
//   const token = crpyto.randomInt(100_000, 1_000_000).toString()

//   const expires = new Date(new Date().getTime() + 5 * 60 * 1000) // 5 minutes time limit

//   const existingToken = await getTwoFactorTokenByEmail(email)

//   if (existingToken) {
//     await db.twoFactorToken.delete({ where: { id: existingToken.id } })
//   }

//   const twoFactorToken = await db.twoFactorToken.create({
//     data: {
//       token,
//       email,
//       expires,
//     },
//   })

//   return twoFactorToken
// }

// two factor confirmation

/**
 * Generates Two factor confrimation and save to database
 * @param userId - Email to verify token
 * @returns - returns generate two factor Confirmation Object including: `userId`
 */
// export const generateTwoFactorConfirmation = async (userId: string) => {
//   try {
//     const existingConfirmation = await db.twoFactorConfirmation.findUnique({
//       where: { userId },
//     })
//     if (existingConfirmation) {
//       await db.twoFactorConfirmation.delete({
//         where: { id: existingConfirmation.id },
//       })
//     }
//     const twoFactorConfirmation = await db.twoFactorConfirmation.create({
//       data: {
//         userId,
//       },
//     })
//     return twoFactorConfirmation
//   } catch (error) {
//     console.log("Error while generating two factor confirmation", error)
//   }
// }
