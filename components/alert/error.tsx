import React from "react"
import { HiOutlineExclamationTriangle } from "react-icons/hi2"

interface ErrorProps {
  message?: string
}
export function Error({ message }: ErrorProps) {
  if (!message) return null

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <HiOutlineExclamationTriangle className="h-5 w-5" />
      <p>{message}</p>
    </div>
  )
}
