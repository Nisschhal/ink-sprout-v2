"use client"
import { useForm } from "react-hook-form"
import CardWrapper from "../CardWrapper"
import { loginSchema, loginSchemaType } from "@/types/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { useState } from "react"
import { Checkbox } from "../ui/checkbox"
import { Button } from "../ui/button"

export function SignupForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  return (
    <CardWrapper
      headerLabel={"Welcom back! 🎉"}
      backButtonLabel={"Don't have an account?"}
      backButtonHref={"/signup"}
      showSocials
    >
      <Form {...form}>
        <form
          action=""
          onSubmit={form.handleSubmit(() => {})}
          className="space-y-6"
        >
          {/* Email Address Field */}
          <FormItem>
            <FormLabel>Email </FormLabel>
            <FormField
              name="email"
              render={({ field }) => (
                <Input {...field} placeholder="youremail@gmail.com" />
              )}
            />
            <FormMessage />
          </FormItem>
          {/* Password Field  */}
          <div className="flex flex-col gap-2">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormField
                name="password"
                render={({ field }) => (
                  <Input
                    {...field}
                    type={`${(showPassword && "text") || "password"}`}
                    placeholder="******"
                  />
                )}
              />
              <FormMessage />
            </FormItem>
            {/* Show password : Checkbox */}
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

          {/* Login Button */}
          <Button className="w-full">Login</Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
