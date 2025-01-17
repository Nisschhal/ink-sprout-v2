"use client"
import { Toaster as Toasty } from "sonner"
import { useTheme } from "next-themes"
import { useEffect } from "react"

export default function Toaster() {
  const { theme, systemTheme, setTheme } = useTheme()

  // check for the system them and set that
  useEffect(() => {
    if (systemTheme) {
      setTheme(systemTheme)
    }
  }, [systemTheme, setTheme])

  return (
    <Toasty
      richColors
      position="top-right"
      theme={theme as "light" | "dark" | "system" | undefined}
    />
  )
}
