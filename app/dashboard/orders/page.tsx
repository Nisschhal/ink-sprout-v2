import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from "@/server"
import { auth } from "@/server/auth"
import { orders } from "@/server/db/schema"
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu"
import { formatDistance, subHours } from "date-fns"
import { eq } from "drizzle-orm"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function OrderRoute() {
  const session = await auth()
  if (!session) return redirect("/auth/login")

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, session.user.id!),

    with: {
      orderProduct: {
        with: {
          products: true,
          productVariants: {
            with: { variantImages: true },
          },
          orders: true,
        },
      },
    },
  })

  return (
    // Card to hold list of orders
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
        <CardDescription>View your orders</CardDescription>
      </CardHeader>

      {/* Card Content for List of Orders in Table */}
      <CardContent>
        <Table>
          <TableCaption>A list of your orders</TableCaption>
          {/* Table Headings */}
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          {/* Table Body */}
          <TableBody>
            {/* List of Order Row */}
            {userOrders.map((order) => (
              <TableRow key={order.id}>
                {/* Order Id */}
                <TableCell>{order.id}</TableCell>
                {/* Total */}
                <TableCell>{order.total}</TableCell>
                {/* Status */}
                <TableCell>
                  <Badge
                    className={
                      order.status === "succeeded"
                        ? "bg-green-700 hover:bg-green-800"
                        : "bg-yellow-700 hover:bg-yellow-800"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                {/* Created At */}
                <TableCell className="text-sm font-medium">
                  {formatDistance(subHours(order.created!, 0), new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
                {/* More Actions: Dropdown with Dialog Alert */}
                <TableCell>
                  {/* Dropdown Model in Dialog */}
                  <Dialog>
                    <DropdownMenu>
                      {/* Dropdown Trigger */}
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      {/* Dropdown Content | Modal */}
                      <DropdownMenuContent
                        className="border bg-accent rounded-md "
                        align="end"
                      >
                        <DropdownMenuItem>
                          {/* Dialog Trigger */}
                          <DialogTrigger asChild>
                            <Button variant="ghost">View Details</Button>
                          </DialogTrigger>
                        </DropdownMenuItem>
                        {order.receiptURL ? (
                          <DropdownMenuItem>
                            <Button variant="ghost">
                              <Link href={order.receiptURL} target="_blank">
                                Download Receipt
                              </Link>
                            </Button>
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Dialog Content: Order Card */}
                    <DialogContent>
                      {/* Dialog Header */}
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Order Details #{order.id}
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription className="text-center">
                        Your order total is: ${order.total}
                      </DialogDescription>
                      <Table>
                        {/* Table Headings */}
                        <TableHeader>
                          <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Quantity</TableHead>
                          </TableRow>
                        </TableHeader>
                        {/* Table Body */}
                        <TableBody>
                          {order.orderProduct.map(
                            ({ id, products, productVariants, quantity }) => (
                              <TableRow key={id}>
                                <TableCell>
                                  <Image
                                    src={productVariants.variantImages[0].url}
                                    alt={products.title}
                                    width={48}
                                    height={48}
                                  />
                                </TableCell>
                                <TableCell>${products.price}</TableCell>
                                <TableCell>{products.title}</TableCell>
                                <TableCell>
                                  <div
                                    className="rounded-full h-4 w-4"
                                    style={{
                                      backgroundColor: productVariants.color,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{quantity}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
