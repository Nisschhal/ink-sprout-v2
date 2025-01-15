"use client"
import { useForm } from "react-hook-form"
import CardWrapper from "../CardWrapper"
import { signupSchema, signupSchemaType } from "@/types/schemas"
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

export function SignupForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const form = useForm<signupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })
  return (
    <CardWrapper
      headerLabel={"Welcom to Ink Sprout! 🙏🏻"}
      backButtonLabel={"Go to login"}
      backButtonHref={"/login"}
      showSocials
    >
      <Form {...form}>
        <form
          action=""
          onSubmit={form.handleSubmit(() => {})}
          className="space-y-4"
        >
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
          <Button className="w-full">Signup</Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
