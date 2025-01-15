import { db } from "@/server"
import { users } from "@/server/db/schema"
import { eq } from "drizzle-orm"

export const getUserById = async (id: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id))
    return user[0]
  } catch (error) {
    console.log("Error while getting user by Id", error)
    return null
  }
}
