"use client"

import NavItem from "./NavItem"

export default function Categories() {
  return (
    <div className="flex gap-4 z-10 items-center justify-center ">
      <NavItem label="All" category="" />
      <NavItem label="Bag" category="bag" />
      <NavItem label="Pen" category="pen" />
      <NavItem label="Pencil" category="pencil" />
      <NavItem label="Notebook" category="notebook" />
    </div>
  )
}
