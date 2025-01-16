import Link from "next/link"
import { UserButton } from "../user-button/UserButton"
import { currentUser } from "@/lib/session-user"
import { Logo } from "./Logo"

export default async function NavBar() {
  const user = await currentUser()
  return (
    <header className="py-8 w-full ">
      <nav className=" ">
        <ul className="flex  items-center justify-between">
          <li>
            <Link href={"/"} aria-label="Logo Ink Sprout">
              <Logo classNames="" />
            </Link>
          </li>
          <li>
            <UserButton user={user} />
          </li>
        </ul>
      </nav>
    </header>
  )
}
