"use server"
import { signIn } from "@/server/auth"
import {
  deleteTwoFactorCodeById,
  getTwoFactorCodeByEmail,
} from "@/data/twoFactorToken"

import { getUserByEmail } from "@/data/user"
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mails"
import {
  generateTwoFactorCode,
  generateTwoFactorConfirmation,
  generateVerificationToken,
} from "@/lib/tokens"
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { loginSchema, loginSchemaType } from "@/types/schemas"
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { AuthError } from "next-auth"

export const login = async (
  values: loginSchemaType
  // callbackUrl?: string | null
) => {
  const validatedFields = loginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalide fields! 😑" }
  }

  const { email, password, code } = validatedFields.data

  // check for correct user and password as well
  // if login via credential then password must be there
  const existingUser = await getUserByEmail(email)
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email doesn't exist! 😔" }
  }

  // check for user verfied
  if (!existingUser.emailVerified) {
    const verficationToken = await generateVerificationToken(email)
    // TODO: send email with verification link
    await sendVerificationEmail(verficationToken.email, verficationToken.token)

    return { success: "Confirmation sent to email! 📩" }
  }

  // check if twofactor enabled and sent code
  if (existingUser.isTwoFactorEnabled) {
    // check if code exist & correct & not expired
    if (code) {
      const twoFactorToken = await getTwoFactorCodeByEmail(existingUser.email)

      if (!twoFactorToken) {
        return { error: "Invalid Code!" }
      }
      if (twoFactorToken.code !== code) {
        return { error: "Wrong Code!" }
      }

      if (twoFactorToken.expiresAt < new Date()) {
        return { error: "Code has expired!" }
      }

      await deleteTwoFactorCodeById(twoFactorToken.id)

      // create confirmation
      await generateTwoFactorConfirmation(existingUser.id)
    } else {
      // if no code send new one
      const twoFactorToken = await generateTwoFactorCode(existingUser.email)
      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.code)
      return { twoFactor: true, success: "Two Factor Code sent to email!" }
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        // error coming from Credential() provider: authorize() function
        case "CredentialsSignin":
          return { error: "Email or Password Incorrect! 🧐" }
        case "AccessDenied":
          return { error: error.message }
        case "OAuthSignInError":
          return { error: error.message }
        default:
          return { error: "Something went wrong in signIn!" }
      }
    }
    // need to throw this i don't know why
    throw error
  }
  return { success: "Login Success!" }
}
