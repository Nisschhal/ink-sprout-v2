"use client"
import { useForm } from "react-hook-form"
import CardWrapper from "../CardWrapper"
import { loginSchema, loginSchemaType } from "@/types/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { useState } from "react"
import { Checkbox } from "../ui/checkbox"
import { Button } from "../ui/button"

export function LoginForm() {
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
          className="space-y-4"
        >
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
          {/* Password Field  */}
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
                      type={`${(showPassword && "text") || "password"}`}
                      placeholder="******"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Login Button */}
          <Button className="w-full">Login</Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
