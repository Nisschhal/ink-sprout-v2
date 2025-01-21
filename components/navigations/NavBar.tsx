"use client"
import Link from "next/link"

import { UserButton } from "../user-button/UserButton"
import { currentUser } from "@/lib/session-user"
import { Logo } from "./Logo"
import CartDrawer from "@/app/product/_components/cart/cart-drawer"
import Categories from "./Categories"
import AlgoliaSearch from "@/app/product/_components/products/algolia"
import { MenuIcon, X } from "lucide-react"
import { User } from "next-auth"
import { useState } from "react"
import FullScreenMenu from "./FullScreenMenu"
import { motion, AnimatePresence } from "motion/react"
import { menuSlide } from "@/lib/animation"
export default function NavBar({ user }: { user: any }) {
  // const user = await currentUser()
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky z-100 border top-0 py-8 px-6 md:px-12 w-full backdrop-blur-md">
      {/* <nav className="w-full">
        <ul className="flex flex-col sm:flex-row sm:justify-between items-center md:gap-8 gap-4">
          <li className="flex">
            <Link href="/" aria-label="sprout and scribble logo">
              <Logo />
            </Link>
          </li>
          <li className="flex flex-1 w-full">
            <AlgoliaSearch />
          </li>
          <li className="">
            <Categories />
          </li>
          <li className="pb-2 relative flex items-center hover:bg-muted cursor-pointer">
            <CartDrawer />
          </li>
          <li className="">
            <UserButton user={user} />
          </li>
        </ul>
      </nav> */}
      {/* Desktop nav */}
      <nav className="hidden lg:block">
        <ul className="flex gap-4 items-center">
          <li className="">
            <Link href="/" aria-label="sprout and scribble logo">
              <Logo />
            </Link>
          </li>
          <li className="flex flex-1 w-full">
            <AlgoliaSearch />
          </li>
          <li className="">
            <Categories />
          </li>
          <li className=" relative flex items-center hover:bg-muted cursor-pointer">
            <CartDrawer />
          </li>
          <li className="">
            <UserButton user={user} />
          </li>
        </ul>
      </nav>

      {/* mobile nav */}
      <nav className="lg:hidden">
        <ul className="">
          <div className="flex justify-between items-center ">
            <Link href="/" aria-label="sprout and scribble logo">
              <Logo />
            </Link>
            <div className="flex items-center  gap-4">
              {/* <li className="">
                <Categories />
              </li> */}
              <li className=" relative flex items-center hover:bg-muted cursor-pointer">
                <CartDrawer />
              </li>
              <li className="">
                <UserButton user={user} />
              </li>
              <li onClick={() => setOpen(!open)}>
                {open ? <X /> : <MenuIcon />}
              </li>
            </div>
          </div>
          <li className="flex flex-1 w-full mt-4">
            <AlgoliaSearch />
          </li>
        </ul>
      </nav>
      {/* <AnimatePresence mode="wait">
        {open && <FullScreenMenu open={open} setOpen={setOpen} />}
      </AnimatePresence> */}
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key="fullscreen-menu"
            variants={menuSlide}
            initial="initial"
            animate="enter"
            exit="exit"
            className="h-screen w-full bg-gradient-to-r from-[#FFFAF0] to-[#FFF8E1] dark:from-black dark:to-black fixed top-0 right-0 text-primary-foreground z-40 font-oswald"
          >
            {open && <FullScreenMenu open={open} setOpen={setOpen} />}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
