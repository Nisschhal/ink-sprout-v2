"use server"

import { db } from "@/server"
import { auth } from "@/server/auth"
import { createSafeActionClient } from "next-safe-action"
import { orderSchema } from "../../_schema/order-schema"
import { orderProduct, orders } from "@/server/db/schema"

const action = createSafeActionClient()

export const createOrder = action
  .schema(orderSchema)
  .action(
    async ({ parsedInput: { products, paymentIntentId, status, total } }) => {
      const session = await auth()
      if (!session?.user) return { error: "User not Found! 🙈" }
      const order = await db
        .insert(orders)
        .values({
          status,
          total,
          paymentIntentId,
          userId: session.user.id!,
        })
        .returning()

      const orderProducts = products.map(
        async ({ productId, variantId, quantity }) => {
          const newOrderProduct = await db
            .insert(orderProduct)
            .values({
              quantity,
              orderId: order[0].id,
              productId,
              productVariantId: variantId,
            })
            .returning()
        }
      )
      return { success: "New order created! 📦" }
    }
  )
