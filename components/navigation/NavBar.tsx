"use client"

import { useCurrentUser } from "@/hooks/user"
import { UserButton } from "../user-button/UserButton"
import { LogIn } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NavBar() {
  const user = useCurrentUser()
  const router = useRouter()
  return (
    <header className="bg-slate-500 py-4">
      <nav className="container">
        <ul className="flex  justify-between">
          <li>Logo</li>
          <li>
            {!user ? (
              <div
                onClick={() => router.push("/api/auth/signin")}
                className="bg-primary flex items-center gap-1.5 p-1 rounded-md"
              >
                <span>
                  <LogIn className="w-4 h-4" />
                </span>
                Login
              </div>
            ) : (
              <UserButton />
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}
