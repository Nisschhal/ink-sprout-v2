"use client"
import { useForm } from "react-hook-form"
import CardWrapper from "../../CardWrapper"
import { signupSchema, signupSchemaType } from "@/types/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form"
import { Input } from "../../ui/input"
import { useEffect, useState, useTransition } from "react"
import { Checkbox } from "../../ui/checkbox"
import { Button } from "../../ui/button"
import { signup } from "@/app/auth/_actions/signup"
import { Error, Success } from "../../alert"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

const initialValues = {
  email: "",
  password: "",
  name: "",
}

export function SignupForm() {
  const searchParams = useSearchParams()

  const role = searchParams.get("role") === "admin" ? "admin" : "user"

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [success, setSuccess] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<signupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: initialValues,
  })

  const onSubmit = (values: signupSchemaType) => {
    setSuccess("")
    setError("")
    // const [serverState, signupAction, isPending] = useActionState(signup, null)

    startTransition(async () => {
      const { success, error } = await signup({ ...values, role })
      if (success) setSuccess(success)
      if (error) setError(error)
    })
  }

  return (
    <CardWrapper
      headerLabel={"Welcome to Ink Sprout! 🙏🏻"}
      backButtonLabel={"Go to login"}
      backButtonHref={"/auth/login"}
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="your name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="youremail@gmail.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show"
                onCheckedChange={() => setShowPassword(!showPassword)}
              />
              <label
                htmlFor="show"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show Password
              </label>
            </div>
          </div>

          {/* Alert : Success | Error */}
          <Success message={success} />
          <Error message={error} />
          <Button className="w-full">
            {(isPending && (
              <>
                <span
                  className="w-5 h-5 border-2 border-blue-500
                        border-t-transparent rounded-full 
                        animate-spin"
                />
                Signing up...
              </>
            )) ||
              "Signup"}
          </Button>
        </form>
      </Form>
      {role !== "admin" && (
        <div>
          <Link
            href={"/auth/signup?role=admin"}
            className="text-sm text-muted-foreground hover:text-primary hover:underline mt-1"
          >
            Signup as admin?
          </Link>
        </div>
      )}
    </CardWrapper>
  )
}
