"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  label: string
  href: string
}

export function Backbutton({ label, href }: BackButtonProps) {
  return (
    <Button variant={"link"} className="w-full font-normal" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  )
}
