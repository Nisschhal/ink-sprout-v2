import { UserButton } from "../user-button/UserButton"
import { currentUser } from "@/lib/session-user"

export default async function NavBar() {
  const user = await currentUser()
  console.log({ user }, "navbar")
  return (
    <header className="bg-slate-500 py-4">
      <nav className="container">
        <ul className="flex  justify-between">
          <li>Logo</li>
          <li>
            <UserButton user={user} />
          </li>
        </ul>
      </nav>
    </header>
  )
}
