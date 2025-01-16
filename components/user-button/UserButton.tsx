"use client"
import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaUser } from "react-icons/fa"
import { LogoutButton } from "@/components/auth/LogoutButton"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"

export function UserButton({ user }: { user: any }) {
  const router = useRouter()
  if (!user)
    return (
      <>
        <div
          onClick={() => router.push("/auth/login")}
          className="bg-primary flex items-center gap-1.5 p-1 rounded-md"
        >
          <span>
            <LogIn className="w-4 h-4" />
          </span>
          Login
        </div>
      </>
    )
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-none outline-none">
        <Avatar>
          <AvatarImage src={user?.image || ""} />

          <AvatarFallback className="bg-sky-400 ">
            <FaUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
