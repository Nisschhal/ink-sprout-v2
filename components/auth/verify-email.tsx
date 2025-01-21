"use client"

import { useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import CardWrapper from "@/components/CardWrapper"
import { Error, Success } from "@/components/alert"
import verifyUser from "@/app/auth/_actions/verify"
export default function VerifyEmail() {
  // error and success state
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  // set the loading state
  const [isLoading, setLoading] = useState(false)

  // get the token from url
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  // verify the token
  const verify = async () => {
    setLoading(true)
    setError("")
    setSuccess("")
    if (token) {
      const { success, error } = await verifyUser(token)
      if (success) setSuccess(success)
      if (error) setError(error)
    } else {
      setError("Token is missing!")
    }
    setLoading(false)
  }

  // verify on mount or token change
  useEffect(() => {
    if (!token) return
    verify()
  }, [token])

  return (
    <CardWrapper
      headerLabel={"Verify your email. "}
      backButtonLabel={"Back to login"}
      backButtonHref={"/auth/login"}
    >
      <div>
        {isLoading ? (
          <div className="flex justify-center gap-x-2">
            <span
              className="w-5 h-5 border-2 border-blue-500
                        border-t-transparent rounded-full 
                        animate-spin"
            />
            Confirming your email! 🧐
          </div>
        ) : (
          <>
            <Error message={error} />
            <Success message={success} />
          </>
        )}
      </div>
    </CardWrapper>
  )
}
