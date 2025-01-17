"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Session } from "next-auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState, useTransition } from "react"
import {
  SettingSchema,
  SettingSchemaType,
} from "@/app/dashboard/settings/_schema/settings-schema"
import { settings } from "@/app/dashboard/settings/_actions/settings"
import { Button } from "@/components/ui/button"
import { Error, Success } from "@/components/alert"
import { Switch } from "@/components/ui/switch"
import { UploadButton } from "@/utils/uploadthing"

type SettingsForm = {
  session: Session
}

export default function SettingsForm({ session: { user } }: SettingsForm) {
  // get the state for error || success || avataruploading
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [isPending, startTranstion] = useTransition()
  // VALIDATE THE FORM INPUT WITH SETTINGSCHEMA AND ADD DEFAULT VALUES FROM THE INCOMING PROPS SESSION  => {USER}
  const form = useForm<SettingSchemaType>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: user?.name || undefined,
      email: user?.email || undefined,
      image: user.image || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  })

  // EXECUTE THE SERVER ACTION USING USEACTION FROM THE 'next-safe-action'
  // you can use default action call as well but a lot of coding there
  // const { execute, status } = useAction(settings, {
  //   onSuccess: ({ data }) => {
  //     if (success) {
  //       setAlertSuccess(true)
  //       setSuccess(data.success)
  //     }
  //     if (data?.error) {
  //       setAlertError(true)
  //       setError(data.error)
  //     }
  //   },
  //   onError: (error) => {
  //     setError("Something went wrong")
  //   },
  // })

  // when form is submitted
  const onSubmit = async (values: z.infer<typeof SettingSchema>) => {
    startTranstion(async () => {
      const { success, error } = await settings(values)
      if (success) {
        setSuccess(success)
      }
      if (error) {
        setError(error)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        {/* // spread the useForm from 'react-form-hook' in the Shadcn Form */}
        <Form {...form}>
          {/* // next form to handle onsubmit function */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* NAME FIELD */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*  IMAGE FIELD */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues("image") && (
                      <div className="font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          src={form.getValues("image")!}
                          width={42}
                          height={42}
                          className="object-cover w-full h-full"
                          alt="User Image"
                        />
                      </div>
                    )}
                    {/* Don't foget to add global.css for upload button */}
                    <UploadButton
                      className="scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"
                      endpoint="avatarUploader"
                      content={{
                        button({ ready }) {
                          if (ready) return <div>Change Avatar</div>
                          return <div>Uploading...</div>
                        },
                      }}
                      onUploadBegin={() => {
                        setAvatarUploading(true)
                      }}
                      onUploadError={(error) => {
                        form.setError("image", {
                          type: "validate",
                          message: error.message,
                        })
                        setAvatarUploading(false)
                        return
                      }}
                      onClientUploadComplete={(res) => {
                        console.log({ res }, "working ")
                        form.setValue("image", res[0].url!)
                        setAvatarUploading(false)
                        return
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="User Image"
                      type="hidden"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PASSWORD FIELD */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      disabled={isPending || user.isOAuth === true}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NEW PASSWORD FIELD */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*******"
                      disabled={isPending || user.isOAuth === true}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TWO FACTOR ON FIELD */}
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two factor authentication for your account
                  </FormDescription>
                  <FormControl>
                    <Switch
                      disabled={isPending || user.isOAuth === true}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ALER MESSAGE */}

            {/* FORM ERROR || SUCCESS */}
            <Error message={error} />
            <Success message={success} />
            {/* SUBMIT BUTTON FIELD */}
            <Button type="submit" disabled={isPending || avatarUploading}>
              Update your settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
