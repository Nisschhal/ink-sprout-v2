import { db } from "@/server"
import { twoFactorCode } from "@/server/db/schema"
import { eq } from "drizzle-orm"

/**
 * Fetches a two factor code associated with the provided email.
 *
 * @param email - The email to find the associated two factor code.
 * @returns - Returns the two factor code if found, otherwise null.
 */
export async function getTwoFactorCodeByEmail(email: string) {
  try {
    const twoFactorToken = await db
      .select()
      .from(twoFactorCode)
      .where(eq(twoFactorCode.email, email))

    return twoFactorToken.length > 0 ? twoFactorToken[0] : null
  } catch (error) {
    console.error("Error fetching two factor code by email:", error)
    return null
  }
}

/**
 * Fetches Two Factor Code data based on the provided code.
 *
 * @param code - The code used to find the associated Two Factor Code.
 * @returns - Returns the Two Factor Code if found, otherwise null.
 */
export async function getTwoFactorCodeByToken(code: string) {
  try {
    const twoFactorToken = await db
      .select()
      .from(twoFactorCode)
      .where(eq(twoFactorCode.code, code))

    return twoFactorToken.length > 0 ? twoFactorToken[0] : null
  } catch (error) {
    console.error("Error fetching two factor code by token:", error)
    return null
  }
}

/**
 * Deletes Two Factor Code for a specific ID.
 *
 * @param id - The unique identifier of the code to be deleted.
 * @returns - A promise resolving when the operation is completed.
 */
export const deleteTwoFactorCodeById = async (id: string) => {
  try {
    await db.delete(twoFactorCode).where(eq(twoFactorCode.id, id))
  } catch (error) {
    console.error("Error while deleting two factor code:", error)
  }
}
