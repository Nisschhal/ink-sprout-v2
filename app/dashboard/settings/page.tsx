import SettingsForm from "@/app/dashboard/settings/_components/setting-form"

import { auth } from "@/server/auth"
import { redirect } from "next/navigation"

export default async function Setting() {
  const session = await auth()
  if (!session) redirect("/")

  return <SettingsForm session={session} />
}
