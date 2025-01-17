import Link from "next/link"
import { UserButton } from "../user-button/UserButton"
import { currentUser } from "@/lib/session-user"
import { Logo } from "./Logo"
import CartDrawer from "@/app/product/_components/cart/cart-drawer"
import Categories from "./Categories"

export default async function NavBar() {
  const user = await currentUser()
  return (
    <header className="sticky z-100 top-0 py-8 w-full ">
      <nav className=" ">
        <ul className="flex justify-between items-center md:gap-8 gap-4">
          <li className="flex flex-1">
            <Link href="/" aria-label="sprout and scribble logo">
              <Logo />
            </Link>
          </li>
          <li>
            <Categories />
          </li>
          <li className="pb-2 relative flex items-center hover:bg-muted cursor-pointer">
            <CartDrawer />
          </li>
          <li>
            <UserButton user={user} />
          </li>
        </ul>
      </nav>
    </header>
  )
}
