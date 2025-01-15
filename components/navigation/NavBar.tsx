"use client"

import { UserButton } from "../user-button/UserButton"

export default function NavBar() {
  return (
    <header className="bg-slate-500 py-4">
      <nav>
        <ul className="flex justify-between">
          <li>Logo</li>
          <li>
            <UserButton />
          </li>
        </ul>
      </nav>
    </header>
  )
}
