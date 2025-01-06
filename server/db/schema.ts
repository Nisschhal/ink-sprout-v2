import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

// Defining an Enum for user roles (user, admin)
export const RoleEnum = pgEnum("roles", ["user", "admin"])

// USER MODEL: Represents users in the system
export const users = pgTable("user", {
  // Unique identifier for the user, generated using crypto.randomUUID
  id: serial("id").primaryKey(),
  name: text("name"), // User's name
  password: text("password"), // User's password
  email: text("email").unique(), // Unique email for the user
  emailVerified: timestamp("emailVerified", { mode: "date" }), // Timestamp when the user's email was verified
  image: text("image"), // URL for user's profile image
  twoFactorEnabled: boolean("twoFactorEnabled").default(false), // Boolean to check if 2FA is enabled
  role: RoleEnum("roles").default("user"), // User's role (user or admin)
  customerId: text("customerId"), // Customer ID associated with an external service
})
