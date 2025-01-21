import { motion } from "framer-motion"
import { scale, slide } from "@/lib/animation"
import Link from "next/link"

interface NavLinkProps {
  item: { title: string; href: string; index: number }
}

const NavLink: React.FC<NavLinkProps> = ({ item }) => {
  const { title, href, index } = item
  return (
    <motion.div
      className="relative flex items-center"
      variants={slide}
      custom={index}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div variants={scale} className="hidden"></motion.div>
      <Link
        href={href}
        className="text-[6vw] text-black uppercase leading-[96%] hover:scale-110 duration-300"
      >
        {title}
      </Link>
    </motion.div>
  )
}

export default NavLink
