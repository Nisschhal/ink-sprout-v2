import Link from "next/link"
import { UserButton } from "../user-button/UserButton"
import { currentUser } from "@/lib/session-user"

export default async function NavBar() {
  const user = await currentUser()
  console.log({ user }, "navbar")
  return (
    <header className="py-8">
      <nav className="container">
        <ul className="flex  items-center justify-between">
          <li>
            <Link href={"/"} aria-label="Logo Ink Sprout">
              Logo
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
