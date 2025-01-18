"use client"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "motion/react"

type NavItemProps = {
  label: string
  category: string
}

export default function NavItem({ label, category }: NavItemProps) {
  const router = useRouter()

  const searchParams = useSearchParams()
  const tag = searchParams.get("tag")
  const handleClick = (category: string) => {
    if (category) {
      router.push(`?tag=${category}`)
    }
    if (!category) router.push("/")
  }
  const active = category == tag

  return (
    <div
      className={cn(
        "cursor-pointer hover:text-primary hover:opacity-100 my-2  rounded",
        active ? "opacity-100 text-primary " : "opacity-50"
      )}
      onClick={() => handleClick(category)}
    >
      {label}
      {category == tag && (
        <motion.div
          className="h-[2px] w-full rounded-full bg-primary "
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          layoutId="underline"
          transition={{ type: "string", stiffness: 35 }}
        />
      )}
    </div>
  )
}
