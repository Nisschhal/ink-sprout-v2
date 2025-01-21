import z from "zod"

// LOGIN SCHEMA-------------
export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required! 👀" })
    .email("Please enter valid email! 😏"),
  password: z.string().nonempty({ message: "Password is required! 👀" }),
  code: z.optional(z.string()),
})

export type loginSchemaType = z.infer<typeof loginSchema>

// SIGNUP SCHEMA------------
export const signupSchema = z.object({
  email: z
    .string({ message: "Email is required! 👀" })
    .email("Please enter valid email! 😏 "),
  password: z
    .string({ message: "Password is required! 👀" })
    .min(5, "Password must be at least 5 characters long! 😉"),
  name: z.string().min(3, "Name must be of atleast 3 character long! 😉"),
  role: z.optional(z.string()),
})

export type signupSchemaType = z.infer<typeof signupSchema>

// RESET PASSWORD--------
export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required! 👀" }),
})

export type ResetSchemaType = z.infer<typeof ResetSchema>

// New PASSWORD Schema -------------
export const NewPasswordSchema = z
  .object({
    password: z.string().min(3, {
      message: "Password must be at least 3 characters long! 😉",
    }),
    password1: z.string().min(3, {
      message: "Password must be at least 3 characters long! 😉",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password1) {
      ctx.addIssue({
        path: ["password1"], // Points to the `password1` field
        message: "Passwords must match! 🧐",
        code: "custom",
      })
    }
  })

export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>
