"use client"
import { useForm } from "react-hook-form"
import CardWrapper from "../../CardWrapper"
import { loginSchema, loginSchemaType } from "@/types/schemas"
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
import { useState, useTransition } from "react"
import { Checkbox } from "../../ui/checkbox"
import { Button } from "../../ui/button"
import { login } from "@/app/auth/_actions/login"
import { Error, Success } from "../../alert"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

export function LoginForm() {
  // Get the same account linked error
  const searchParams = useSearchParams()
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : ""

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const [success, setSuccess] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isPending, startTransition] = useTransition()
  const [showTwoFactor, setShowTwoFactor] = useState(false)

  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  })

  const onSubmit = (values: loginSchemaType) => {
    setSuccess("")
    setError("")
    // const [serverState, signupAction, isPending] = useActionState(signup, null)

    startTransition(async () => {
      const { success, error, twoFactor } = await login(values)
      if (success) setSuccess(success)
      if (error) setError(error)
      if (twoFactor) setShowTwoFactor(true)
    })
  }

  return (
    <CardWrapper
      headerLabel={"Welcom back! 🎉"}
      backButtonLabel={"Don't have an account?"}
      backButtonHref={"/auth/signup"}
      showSocials
    >
      <Form {...form}>
        <form
          action=""
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Two Factor Code Input */}
          {/* Two Factor  */}
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123456"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Login Inputs */}
          {!showTwoFactor && (
            <>
              {/* Email Address Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email </FormLabel>
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
                {/*  Show Password */}
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
            </>
          )}
          {/* Alert : Success | Error */}
          <Success message={success} />
          <Error message={error || urlError} />
          <Button className="w-full">
            {(isPending && (
              <>
                <span
                  className="w-5 h-5 border-2 border-blue-500
                        border-t-transparent rounded-full 
                        animate-spin"
                />
                Logging in...
              </>
            )) ||
              "Login"}
          </Button>
          {/*  Forgot Password */}
          <Link
            href={"/auth/reset"}
            className="text-sm text-muted-foreground  hover:text-black hover:underline"
          >
            Forgot Password?
          </Link>
        </form>
      </Form>
    </CardWrapper>
  )
}
