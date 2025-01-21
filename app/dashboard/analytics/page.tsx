import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/server"
import Sales from "./sales"
import Earnings from "./earnings"
import { TotalOrders } from "@/lib/infer-type"

export const revalidate = 0

export default async function Analytics() {
  let totalOrders: TotalOrders[] = []

  try {
    totalOrders = await db.query.orderProduct.findMany({
      limit: 10,
      with: {
        orders: { with: { users: true } },
        products: true,

        productVariants: { with: { variantImages: true } },
      },
    })
  } catch (error) {
    console.log("Error getting totalorders for analytics", error)
  }

  if (totalOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Orders to show!</CardTitle>
        </CardHeader>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>View Analytics</CardTitle>
        <CardDescription>
          Check sales, new customers, and more...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row gap-8 ">
        <Sales totalOrders={totalOrders} />
        <Earnings totalOrders={totalOrders} />
      </CardContent>
    </Card>
  )
}
