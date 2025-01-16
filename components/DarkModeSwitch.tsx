import { cn } from "@/lib/utils"
import React from "react"
import { motion } from "motion/react"
import { Sun } from "lucide-react"
import { RxMoon } from "react-icons/rx"
export default function DarkModeSwitch({
  theme,
}: {
  theme: string | undefined
}) {
  return (
    <div
      className={cn("flex items-center w-10 p-0.5  border rounded-full", {
        "bg-primary/10 flex-start": theme == "light",
        "justify-end bg-gray-700": theme == "dark",
      })}
    >
      {theme == "light" ? (
        <motion.span layout>
          <Sun className=" rounded-full border" />
        </motion.span>
      ) : (
        <motion.span layout>
          <RxMoon width={14} />
        </motion.span>
      )}
    </div>
  )
}
