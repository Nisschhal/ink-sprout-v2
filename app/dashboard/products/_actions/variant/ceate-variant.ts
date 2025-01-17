"use server"
import { createSafeActionClient } from "next-safe-action"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { variantSchema } from "../../_schemas/variant-schema"
import { db } from "@/server"
import {
  products,
  productVariants,
  variantImages,
  variantTags,
} from "@/server/db/schema"

const action = createSafeActionClient()

// get the algolio import
import { algoliasearch } from "algoliasearch"
import { title } from "process"

// create a algolio client
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_WRITE_API_KEY!
)

// create index for algolio to add products
const algoliaIndex = "products"

export const createVariant = action
  .schema(variantSchema)
  .action(
    async ({
      parsedInput: {
        editMode,
        id,
        productId,
        productType,
        color,
        tags,
        variantImages: newImages,
      },
    }) => {
      try {
        // get the product for algolio
        const product = await db.query.products.findFirst({
          where: eq(products.id, productId),
        })

        if (editMode && id) {
          const editVarianted = await db
            .update(productVariants)
            .set({ color, productType, updated: new Date() })
            .where(eq(productVariants.id, id))
            .returning()

          // UPDATE THE ALGOLIO OBJECT
          await client.partialUpdateObject({
            indexName: algoliaIndex,
            objectID: editVarianted[0].id.toString(),
            attributesToUpdate: {
              id: editVarianted[0].id,
              title: product?.title,
              price: product?.price,
              productType: editVarianted[0].productType,
              variantImages: newImages[0].url,
            },
          })

          // DELETE the old tags and INSERT THE INCOMING tags from the form
          await db
            .delete(variantTags)
            .where(eq(variantTags.variantId, editVarianted[0].id))
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantId: editVarianted[0].id,
            }))
          )

          // DELETE the old image and save the incoming image from the form
          await db
            .delete(variantImages)
            .where(eq(variantImages.variantId, editVarianted[0].id))
          await db.insert(variantImages).values(
            newImages.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantId: editVarianted[0].id,
              order: idx,
            }))
          )

          // once everything done revalidate the cache
          revalidatePath("/dashboard/products")
          return {
            success: `Variant updated successfully! 🎉`,
          }
        }

        // CREATE NEW VARIANT
        // not a edit mode so create a new one
        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productId,
            })
            .returning()

          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantId: newVariant[0].id,
            }))
          )
          await db.insert(variantImages).values(
            newImages.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantId: newVariant[0].id,
              order: idx,
            }))
          )
          // ALGOLIO SAVE if product found save to algolio
          if (product) {
            await client.saveObject({
              indexName: algoliaIndex,
              body: {
                objectID: newVariant[0].id.toString(),
                id: product.id,
                title: product.title,
                price: product.price,
                productType: newVariant[0].productType,
                variantImages: newImages[0].url,
              },
            })
          }
          revalidatePath("/dashboard/products")
          return { success: `Variant created successfully! 🎉` }
        }
      } catch (error) {
        console.log("error while creating or updating variant", error)
        return { error: `Failed to create Variant! ` }
      }
    }
  )
