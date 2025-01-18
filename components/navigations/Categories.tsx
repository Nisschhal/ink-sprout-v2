"use client"

import { useState } from "react"
import NavItem from "./NavItem"
import { MenuIcon, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"

export default function Categories() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(true)

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)
  const handleRoute = (tag: string) => {
    router.push(`?tag=${tag}`)
    setMenuOpen(false)
  }
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

      {/* Mobile Menu Toggle */}
      <div className="sm:hidden">
        <button
          onClick={toggleMenu}
          className="flex items-center p-2 cursor-pointer text-gray-700 dark:text-white"
          aria-label="Toggle Menu"
        >
          <MenuIcon />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            animate={{
              x: menuOpen ? 0 : "100%",
            }}
            initial={{ x: "100%" }}
            exit={{ x: "100%" }}
            transition={{
              ease: "easeInOut",
            }}
            className={cn(
              "absolute inset-0 w-screen h-screen backdrop-blur-md z-[999]"
            )}
          >
            <button
              onClick={closeMenu}
              className="absolute top-4 right-10 text-white"
              aria-label="Close Menu"
            >
              <X />
            </button>

            <div className="mt-16 space-y-4 px-6">
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => handleRoute("")}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    All
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleRoute("bag")}
                    className="text-right text-white hover:text-gray-300 transition-colors"
                  >
                    Bag
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleRoute("pen")}
                    className="text-right text-white hover:text-gray-300 transition-colors"
                  >
                    Pen
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleRoute("pencil")}
                    className="text-right text-white hover:text-gray-300 transition-colors"
                  >
                    Pencil
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleRoute("notebook")}
                    className="text-right text-white hover:text-gray-300 transition-colors"
                  >
                    Notebook
                  </button>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black opacity-50 z-40 pointer-events-auto"
        ></div>
      )}
    </div>
  )
}
