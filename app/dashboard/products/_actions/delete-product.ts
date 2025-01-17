"use server"
import { createSafeActionClient } from "next-safe-action"
import { db } from "@/server"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { products } from "@/server/db/schema"

const action = createSafeActionClient()

export const deleteProduct = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      if (!id) return { error: "No such Product Delete!" }

      const deleteProduct = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning()

      revalidatePath("/dashboard/products")
      return {
        success: `Product "${deleteProduct[0].title}" deleted Successfully!`,
      }
    } catch (error) {
      console.log("error while deleting product", error)
    }
  })
