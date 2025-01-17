import { cn } from "@/lib/utils"
import React from "react"
import { motion } from "motion/react"
export default function DarkModeSwitch({
  theme,
}: {
  theme: string | undefined
}) {
  return (
    <div
      className={cn("flex items-center w-10   rounded-full", {
        "bg-primary/10 flex-start": theme == "light",
        "justify-end bg-primary": theme == "dark",
      })}
    >
      {theme == "light" ? (
        <motion.div layout>
          <div className="bg-white rounded-full h-5 w-5 shadow-lg"></div>
        </motion.div>
      ) : (
        <motion.div layout>
          <div className="bg-white rounded-full h-5 w-5 shadow-lg"></div>
        </motion.div>
      )}
    </div>
  )
}
