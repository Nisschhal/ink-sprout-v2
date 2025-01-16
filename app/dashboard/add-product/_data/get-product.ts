// import { db } from "@/server"
// import { products } from "@/server/db/schema"
// import { eq } from "drizzle-orm"

// // Define the return type for better type safety
// type ProductResponse = { data?: any; success?: string; error?: string }

// export const getProductById = async (id: number): Promise<ProductResponse> => {
//   try {
//     if (!id) {
//       return { error: "No such Product!" }
//     }

//     // Query the database
//     const product = await db.select().from(products).where(eq(products.id, id))

//     // Check if the product array is empty
//     if (!product || product.length === 0) {
//       return { error: "No product Found!" }
//     }

//     // Return the first product in the array
//     return { data: product[0], success: "Product found!" }
//   } catch (error) {
//     console.error("Error while getting product by ID:", error)
//     return { error: "An unexpected error occurred while fetching the product." }
//   }
// }

"use server"
import { createSafeActionClient } from "next-safe-action"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/server"
import { products } from "@/server/db/schema"

const action = createSafeActionClient()

export const getProductById = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      if (!id) return { error: "No such Product 🧐!" }

      const product = await db.query.products.findFirst({
        where: eq(products.id, id),
      })

      if (!product) return { error: "No product Found! 🙈" }

      return {
        success: `Product ${product.title} created Successfully!`,
        product,
      }
    } catch (error) {
      console.log("Error while deleting product", error)
    }
  })
