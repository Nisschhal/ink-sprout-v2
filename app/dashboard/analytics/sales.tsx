"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table"
import { TotalOrders } from "@/lib/infer-type"
import Image from "next/image"
import placeholder from "@/public/placeholder_user.jpg"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
export default function Sales({ totalOrders }: { totalOrders: TotalOrders[] }) {
  return (
    <Card className="flex-1 shrink-0">
      <CardHeader>
        <CardTitle>New sales</CardTitle>
        <CardDescription>Here are your recent sales</CardDescription>
      </CardHeader>
      <CardContent className="h-96 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customers</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalOrders.map(
              ({
                orders,
                products,
                productVariants,
                orderId,
                productId,
                productVariantId,
                id,
                quantity,
              }) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">
                    {orders.users.image && orders.users.name ? (
                      <div className="flex gap-2 w-32 items-center ">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            src={orders.users.image}
                            width={42}
                            height={42}
                            className="object-cover w-full h-full"
                            alt="User Image"
                          />
                        </div>
                        <p className="text-sm font-medium">
                          {orders.users.name}
                        </p>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center ">
                        <p className="text-sm font-medium">
                          {orders.users.name}
                        </p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{products.title}</TableCell>
                  <TableCell>{products.price}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>
                    <Image
                      src={productVariants.variantImages[0].url}
                      alt={products.title}
                      height={48}
                      width={48}
                    />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
