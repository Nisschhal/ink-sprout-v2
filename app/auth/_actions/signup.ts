"use server"
import bcrypt from "bcryptjs"
import * as z from "zod"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens"
import { signupSchema, signupSchemaType } from "@/types/schemas"
import { db } from "@/server"
import { users } from "@/server/db/schema"
import { sendVerificationEmail } from "@/lib/mails"

// import { sendVerificationEmail } from "@/lib/mail"

export const signup = async (values: z.infer<typeof signupSchema>) => {
  const validatedFields = signupSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalide fields! 😑" }
  }

  const { email, password, name } = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) return { error: "Email already in use! 😔" }

  await db.insert(users).values({
    email,
    password: hashedPassword,
    name,
  })

  const verficationToken = await generateVerificationToken(email)
  console.log({ verficationToken })
  // TODO: send verification token
  // TODO: send email with verification link
  await sendVerificationEmail(verficationToken.email, verficationToken.token)

  return { success: "Confirmation sent to email! 📩" }
}
