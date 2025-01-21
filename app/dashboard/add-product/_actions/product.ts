"use server"

import { createSafeActionClient } from "next-safe-action"
import { eq } from "drizzle-orm"
import { productSchema } from "../_schema/product-schema"
import { db } from "@/server"
import { products } from "@/server/db/schema"
import { auth } from "@/server/auth"

const action = createSafeActionClient()
export const product = action
  .schema(productSchema)
  .action(async ({ parsedInput: { id, title, description, price } }) => {
    const session = await auth()
    try {
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        })
        if (!currentProduct) return { error: "Product not Found! 🙈" }

        await db
          .update(products)
          .set({ title, description, price })
          .where(eq(products.id, id))

        return {
          success: `Product Updated Successfully! 🎉 `,
        }
      } else {
        if (!id) {
          await db
            .insert(products)
            .values({ title, price, description, createdBy: session?.user.id })

          return { success: `New Product ${title} created successfully! 🎉` }
        }
      }
    } catch (error) {
      return { error: JSON.stringify(error) }
    }
  })
