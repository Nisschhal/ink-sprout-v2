"use client"

import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { useSearchParams } from "next/navigation"

export function Social() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      //   redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT || "/",
      redirectTo: callbackUrl || "/",
    })
  }
  return (
    <div className="w-full flex items-center gap-x-2">
      <Button
        className="w-full"
        variant={"outline"}
        onClick={() => onClick("google")}
      >
        <FcGoogle />
      </Button>
      <Button
        className="w-full"
        variant={"outline"}
        onClick={() => onClick("github")}
      >
        <FaGithub />
      </Button>
    </div>
  )
}
