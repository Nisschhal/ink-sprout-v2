import z from "zod"

// LOGIN SCHEMA
export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required!" })
    .email("Please enter valid email!"),
  password: z.string({ message: "Password is required!" }),
})

export type loginSchemaType = z.infer<typeof loginSchema>

// SIGNUP SCHEMA
export const signupSchema = z.object({
  email: z
    .string({ message: "Email is required!" })
    .email("Please enter valid email!"),
  password: z
    .string({ message: "Password is required!" })
    .min(5, "Password must be at least 5 characters long! "),
  name: z.string().min(3, "Name must be of atleast 3 character long!"),
})

export type signupSchemaType = z.infer<typeof signupSchema>
