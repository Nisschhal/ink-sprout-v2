import CardWrapper from "@/components/CardWrapper"
import React from "react"
import { HiOutlineExclamationTriangle } from "react-icons/hi2"

export default function ErrorCard() {
  return (
    <CardWrapper
      headerLabel={"Oops!, something went wrong, try again!😬"}
      backButtonLabel={"Go to login"}
      backButtonHref={"/auth/login"}
    >
      <div className="flex items-center justify-center">
        <HiOutlineExclamationTriangle className="w-5 h-5  text-destructive" />
      </div>
    </CardWrapper>
  )
}
