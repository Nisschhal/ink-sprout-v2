import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

//-----Next-Auth---- docs might used AdapterAccoutType so rename it to AdapterAccount
import type { AdapterAccount } from "next-auth/adapters"

// Defining an Enum for user roles (user, admin)
export const RoleEnum = pgEnum("roles", ["user", "admin"])

// USER MODEL: Represents users in the system
export const users = pgTable("user", {
  // Unique identifier for the user, generated using crypto.randomUUID
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"), // User's name
  password: text("password"), // User's password
  email: text("email").unique(), // Unique email for the user
  emailVerified: timestamp("emailVerified", { mode: "date" }), // Timestamp when the user's email was verified
  image: text("image"), // URL for user's profile image
  twoFactorEnabled: boolean("twoFactorEnabled").default(false), // Boolean to check if 2FA is enabled
  role: RoleEnum("roles").default("user"), // User's role (user or admin)
  customerId: text("customerId"), // Customer ID associated with an external service
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)
