"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DollarSign, Loader2 } from "lucide-react"
import Tiptap from "./tiptap"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { getProductById } from "../_data/get-product"
import { product } from "../_actions/product"
import { productSchema, ProductSchemaType } from "../_schema/product-schema"

export default function ProductForm() {
  const router = useRouter() // Handles navigation
  const params = useSearchParams() // Retrieves query parameters
  const id = parseInt(params.get("id") as string) // Get product ID from URL if present

  // Function to check if editing an existing product
  const checkProduct = async () => {
    if (id) {
      const data = await getProductById({ id }) // Fetch product details
      if (data?.data?.error) {
        router.push("/dashboard/products") // Redirect if product not found
        return
      }
      if (data?.data?.success) {
        // Pre-fill form with existing product details
        form.setValue("id", data.data.product.id)
        form.setValue("title", data.data.product.title)
        form.setValue("description", data.data.product.description)
        form.setValue("price", data.data.product.price)
      }
    }
  }

  useEffect(() => {
    checkProduct() // Load product data if editing
  }, [])

  // Form setup using react-hook-form and zod for validation
  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange", // Validate on change for better user experience
  })

  // Safe action to handle form submission
  const { execute, status } = useAction(product, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        console.log("Redirection happening...") // Debug message
        router.push("/dashboard/products") // Redirect to products page
        setTimeout(() => toast.success(data.success), 500) // Show success message after redirect
      } else if (data?.error) {
        toast.error(data.error) // Show error toast
      }
    },
    onExecute: () => {
      toast.info(
        id ? "Updating existing product..." : "Creating new product...",
        { duration: 2000 }
      ) // Inform the user about the action in progress
    },
    onError: (error) => {
      console.error("Action execution error:", error) // Log any error
    },
  })

  // Submit handler for the form
  const onSubmit = async (values: ProductSchemaType) => {
    console.log("Submitting values:", values) // Debug submitted values
    if (id) {
      execute({ id, ...values }) // Update product
    } else {
      execute(values) // Create new product
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-1">
        <CardTitle>{id ? "Edit Product" : "Add New Product"}</CardTitle>
        <CardDescription>
          {id
            ? "Make a change to existing product 📝"
            : "Create a brand new product 🗽"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)} // Handle form submission
            className="space-y-4 md:space-y-6"
          >
            {/* Product Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Marker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <DollarSign
                        size={36}
                        className="p-2 bg-muted rounded-md"
                      />
                      <Input
                        placeholder="Your price in USD"
                        type="number"
                        step={0.1}
                        min={0}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              disabled={
                status == "executing" || // Disable if action is in progress
                !form.formState.isValid || // Disable if form is invalid
                !form.formState.isDirty // Disable if no changes made
              }
              className="w-full"
              type="submit"
            >
              {status == "executing" ? (
                <>
                  <Loader2 className="animate-spin size-3.5" />{" "}
                  <span>{id ? "Updating..." : "Submitting..."}</span>
                </>
              ) : (
                <>{id ? "Save Changes" : "Create New Product"}</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
