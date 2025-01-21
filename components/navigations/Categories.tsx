"use client"

import NavItem from "./NavItem"

export default function Categories() {
  return (
    <div className="">
      {/* Desktop Categories */}
      <div className="hidden sm:flex gap-4 items-center justify-center">
        <NavItem label="All" category="all" />
        <NavItem label="Bag" category="bag" />
        <NavItem label="Pen" category="pen" />
        <NavItem label="Pencil" category="pencil" />
        <NavItem label="Notebook" category="notebook" />
      </div>
    </div>
  )
}
