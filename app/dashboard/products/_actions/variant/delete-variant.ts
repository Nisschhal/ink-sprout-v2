"use server"

import { createSafeActionClient } from "next-safe-action"
import * as z from "zod"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { productVariants } from "@/server/db/schema"
import { db } from "@/server"

// get the algolio import
import { algoliasearch } from "algoliasearch"

const action = createSafeActionClient()
// create a algolio client
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY!
)

// create index for algolio to add products
const algoliaIndex = "products"

//

export const deleteVariant = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      // delete from the db and get that data
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning()
      revalidatePath("/dashboard/products")

      // also delete from algolio from deleted data
      const algo = await client.deleteObject({
        indexName: algoliaIndex,
        objectID: deletedVariant[0].id.toString(),
      })

      console.log({ algo })

      revalidatePath("/dashboard/products")
      return {
        success: `Product Variant deleted Successfully! 👏 `,
      }
    } catch (error) {
      console.log("Error while deleting variant", error)
      return { error: "Couldn't delete variant!" }
    }
  })
