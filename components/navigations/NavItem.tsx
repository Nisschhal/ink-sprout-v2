"use client"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"

type NavItemProps = {
  label: string
  category: string
}

export default function NavItem({ label, category }: NavItemProps) {
  const router = useRouter()

  const searchParams = useSearchParams()
  const tag = searchParams.get("tag")

  const handleClick = () => {
    if (tag) {
      router.push(`?tag=${category}`)
    } else {
      router.push("/")
    }
  }
  const active = category === tag

  return (
    <div
      className={cn(
        "cursor-pointer hover:text-primary hover:opacity-100 my-2  rounded",
        active ? "opacity-100 text-primary" : "opacity-50 text-gray-600"
      )}
      onClick={handleClick}
    >
      {label}
    </div>
  )
}
