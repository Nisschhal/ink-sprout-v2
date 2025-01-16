import { db } from "@/server"
import { twoFactorConfirmations } from "@/server/db/schema"
import { eq } from "drizzle-orm"

/**
 * Fetches Two Factor Confirmation data based on the given user ID.
 *
 * @param userId - The unique identifier of the user.
 * @returns - The Two Factor Confirmation data if found, otherwise `null`.
 */
export async function getTwoFactorConfirmationByUserId(userId: string) {
  try {
    const confirmation = await db
      .select()
      .from(twoFactorConfirmations)
      .where(eq(twoFactorConfirmations.userId, userId))

    return confirmation[0] || null
  } catch (error) {
    console.error("Error fetching two factor confirmation for user ID:", error)
    return null
  }
}

/**
 * Deletes Two Factor Confirmation for a specific user.
 *
 * @param userId - The unique identifier of the user whose confirmation needs to be deleted.
 * @returns - A promise resolving when the operation is completed.
 */
export const deleteTwoFactorConfirmation = async (userId: string) => {
  try {
    await db
      .delete(twoFactorConfirmations)
      .where(eq(twoFactorConfirmations.userId, userId))
  } catch (error) {
    console.error("Error while deleting two factor confirmation:", error)
  }
}
