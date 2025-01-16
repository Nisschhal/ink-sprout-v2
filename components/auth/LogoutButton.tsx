"use client"

import { LogOutIcon } from "lucide-react"
import { signOut } from "next-auth/react"

export function LogoutButton() {
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    signOut() // Call the server-side logout logic
  }

  return (
    <span
      className="flex  items-center gap-x-2 cursor-pointer"
      onClick={onClick}
    >
      <LogOutIcon className="w-4 h-4" /> Logout
    </span>
  )
}
