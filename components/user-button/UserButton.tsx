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
import { LogIn, LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react"
import type { Session, User } from "next-auth"
import Image from "next/image"
import { signOut } from "next-auth/react"

export const AvaterIcon = ({ user }: { user: User }) => {
  return (
    <Avatar>
      <AvatarImage src={user?.image || ""} />
      <AvatarFallback className="bg-primary/25 ">
        {/* <FaUser /> */}
        <div className="font-bold">{user.name?.charAt(0).toUpperCase()}</div>
      </AvatarFallback>
    </Avatar>
  )
}

export function UserButton({ user }: { user: User }) {
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
        <AvaterIcon user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-6 space-y-2">
        <div className="mb-4 p-4 flex flex-col gap-1 items-center justify-center rounded-sm bg-primary/10">
          {/* {user.image && (
            <Image src={user.image} alt="user " width={36} height={36} />
          )} */}
          <AvaterIcon user={user} />
          <p className="font-bold text-xs"> {user.name}</p>
          <p className="font-medium text-xs"> {user.email}</p>
        </div>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="group font-medium cursor-pointer">
          <TruckIcon
            width={14}
            className="mr-2 group-hover:translate-x-3 duration-500 transition-all"
          />
          My Orders
        </DropdownMenuItem>
        <DropdownMenuItem className="group font-medium cursor-pointer">
          <Settings
            width={14}
            className="mr-2 group-hover:rotate-180 duration-500 transition-all"
          />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="font-medium cursor-pointer">
          <div className="flex">
            <Sun />
            <Moon />
            Theme
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="group font-medium cursor-pointer focus:bg-destructive/30 duration-500 transition-all"
          onClick={() => signOut()}
        >
          <LogOut
            width={14}
            className="mr-2 group-hover:scale-90 duration-500 transition-all "
          />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
