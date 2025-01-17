import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import { variantSchema, VariantSchemaType } from "../../_schemas/variant-schema"
import { createVariant } from "../../_actions/variant/create-variant"
import { deleteVariant } from "../../_actions/variant/delete-variant"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import InputTags from "./input-tags"
import VariantImages from "./variant-images"
import { VariantsWithImagesTags } from "@/lib/infer-type"

type VariantProps = {
  children: React.ReactNode
  editMode: boolean
  productId?: number
  variant?: VariantsWithImagesTags
}

export default function ProductVariant({
  children,
  editMode,
  productId,
  variant,
}: VariantProps) {
  const form = useForm<VariantSchemaType>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      tags: [],
      variantImages: [],
      color: "#000000",
      editMode,
      id: undefined,
      productId,
      productType: "Black Notebook",
    },
  })

  const [open, setOpen] = useState(false)

  const setEdit = () => {
    if (!editMode) {
      form.reset()
      return
    }
    if (editMode && variant) {
      form.setValue("editMode", true)
      form.setValue("id", variant.id)
      form.setValue("productId", variant.productId)
      form.setValue("productType", variant.productType)
      form.setValue("color", variant.color)
      form.setValue(
        "tags",
        variant.variantTags.map((tag) => tag.tag)
      )
      form.setValue("variantImages", variant.variantImages)
    }
  }

  useEffect(() => {
    setEdit()
  }, [variant])

  const { execute, status } = useAction(createVariant, {
    onExecute() {
      toast.info(`${editMode ? "Updating" : "Creating new"} variant...`, {
        duration: 2000,
      })
      setOpen(false)
    },
    onSuccess({ data }) {
      if (data?.error) {
        toast.error(data.error)
      }
      if (data?.success) {
        toast.success(data.success)
        form.reset() // Reset the form after a successful create or update
      }
    },
  })

  const variantAction = useAction(deleteVariant, {
    onExecute() {
      toast.info("Deleting variant...", { duration: 2000 })
      setOpen(false)
    },
    onSuccess({ data }) {
      if (data?.error) {
        toast.error(data.error)
      }
      if (data?.success) {
        toast.success(data.success)
        form.reset() // Reset the form after a successful delete
      }
    },
  })

  function onSubmit(values: VariantSchemaType) {
    execute(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[660px]  ">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit" : "Create"} your variant</DialogTitle>
          <DialogDescription>
            Manage your product variants here. You can add tags, images, and
            more.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pick a title for your variant"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} onChange={(e) => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <VariantImages />
            <div className="flex gap-4 items-center justify-center">
              {editMode && variant && (
                <Button
                  variant={"destructive"}
                  type="button"
                  disabled={variantAction.status === "executing"}
                  onClick={(e) => {
                    e.preventDefault()
                    variantAction.execute({ id: variant.id })
                  }}
                >
                  Delete Variant
                </Button>
              )}
              <Button
                disabled={
                  status === "executing" ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
                }
                type="submit"
              >
                {editMode ? "Update Variant" : "Create Variant"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
