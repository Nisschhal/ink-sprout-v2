import { auth } from "@/auth"

// instead of directly export import auth for further intercept to check auth
export default auth((req) => {
  const auth = req.auth
  //   console.log({ auth })
})
