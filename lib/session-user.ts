import { auth } from "@/server/auth"

export async function currentUser() {
  const session = await auth()
  // console.log({ session })
  return session?.user
}
