"use client"
import React, { useState } from "react"
import { MenuIcon, X } from "lucide-react"

export default function NavHeader() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className="flex items-center gap-2">
        {/* <NavBar /> */}
        <div onClick={() => setOpen(!open)}>{open ? <X /> : <MenuIcon />}</div>
      </div>
      {/* {open && <FullScreenMenu open={open} setOpen={setOpen} />} */}
    </div>
  )
}
