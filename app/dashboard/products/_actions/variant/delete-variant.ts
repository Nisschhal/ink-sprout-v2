"use server"

import { createSafeActionClient } from "next-safe-action"
import * as z from "zod"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { productVariants } from "@/server/db/schema"
import { db } from "@/server"
const action = createSafeActionClient()

export const deleteVariant = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning()
      revalidatePath("/dashboard/products")
      return {
        success: `Product Variant deleted Successfully! 👏 `,
      }
    } catch (error) {
      console.log("Error while deleting variant", error)
      return { error: "Couldn't delete variant!" }
    }
  })
