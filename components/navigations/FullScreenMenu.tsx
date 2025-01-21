import { motion } from "framer-motion"
import { slide } from "@/lib/animation"
import { AnimatePresence } from "framer-motion"
import { Logo } from "./Logo"
import { MenuIcon, X } from "lucide-react"
import Link from "next/link"

export default function FullScreenMenu({
  setOpen,
  open,
}: {
  open: boolean
  setOpen: (val: boolean) => void
}) {
  return (
    <div>
      {/* -------- Header -------------  */}
      <div className="flex justify-between items-center p-8">
        <Logo />
        <div className="" onClick={() => setOpen(!open)}>
          {open ? (
            <X className="w-7 h-7 text-black dark:text-white" />
          ) : (
            <MenuIcon />
          )}
        </div>
      </div>
      {/* Menu Item */}
      <motion.div className="flex flex-col items-center mt-8">
        <AnimatePresence>
          {navItems.map(({ title, href }, index) => (
            <motion.div
              variants={slide}
              initial="initial"
              animate="enter"
              exit="exit"
              custom={index}
              key={index}
              onClick={() => setOpen(!open)}
              className="text-black"
            >
              <Link
                href={href}
                className="text-[40px] font-medium dark:text-white"
              >
                {title}
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export const navItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Pen",
    href: "/?tag=pen",
  },
  {
    title: "Pencil",
    href: "/?tag=pencil",
  },
  {
    title: "Notebook",
    href: "/?tag=Notebook",
  },
  {
    title: "Bag",
    href: "/?tag=bag",
  },
]
