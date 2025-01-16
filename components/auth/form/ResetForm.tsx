"use client"
import { resetPassword } from "@/app/auth/_actions/reset"
import { Error, Success } from "@/components/alert"
import CardWrapper from "@/components/CardWrapper"
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
import { ResetSchema, ResetSchemaType } from "@/types/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

export default function ResetForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const form = useForm<ResetSchemaType>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (values: ResetSchemaType) => {
    setError("")
    setSuccess("")
    startTransition(async () => {
      const result = await resetPassword(values)

      // Fallback in case `result` is undefined or invalid
      if (!result) {
        setError("Unexpected error, please try again!")
        return
      }

      const { error, success } = result // Safely destructure

      if (error) {
        setError(error)
      }
      if (success) {
        setSuccess(success)
      }
    })
  }

  return (
    <CardWrapper
      headerLabel={"Forgot your password?"}
      backButtonLabel={"Back to login"}
      backButtonHref={"/auth/login"}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  {/* Spread ...field for controlled input */}
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="nischal.dev@example.com"
                    //   disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Error message={error} />
          <Success message={success} />
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <span
                  className="w-5 h-5 border-2 border-blue-500
                        border-t-transparent rounded-full 
                        animate-spin"
                />
                Sending email...
              </>
            ) : (
              "Rest Password"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
