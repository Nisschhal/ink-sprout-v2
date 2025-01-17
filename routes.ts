/**
 * An array of routes that are accesible to public
 * The routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "/",
  "/products",
  "/auth/verify-email",
  "/auth/reset",
  "/auth/new-password",
]

/**
 * An array of routes that are used for authentication
 * This routes will redirect logged in user to /settings
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/auth/login",
  "/auth/signup",
  "/auth/error",
  "/dashboard",
]

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */

export const apiAuthPrefix: string = "/api/auth"
export const isApiUploadethingPrefix: string = "/api/uploadthing"

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard/settings"
