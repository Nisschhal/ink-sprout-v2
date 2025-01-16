//-----Next-Auth---- docs might used AdapterAccoutType so rename it to AdapterAccount
import type { AdapterAccount } from "next-auth/adapters"

import {
  AnyPgColumn,
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

// Defining an Enum for user roles (user, admin)
export const RoleEnum = pgEnum("roles", ["user", "admin"])

// USER MODEL: Represents users in the system
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  password: text("password"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
  role: RoleEnum("roles").default("user"),
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

// Verification token
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (table) => ({
    uniqueToken: uniqueIndex("unique_email_token_idx").on(
      table.email,
      table.token
    ), // Renamed index
  })
)

// Password Reset token
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (table) => ({
    uniqueToken: uniqueIndex("unique_email_reset_token_idx").on(
      table.email,
      table.token
    ), // Renamed index
  })
)

// Two Factor token
export const twoFactorCode = pgTable(
  "two_factor_codes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    code: text("code").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (table) => ({
    uniqueToken: uniqueIndex("unique_email_code_idx").on(
      table.email,
      table.code
    ), // Renamed index
  })
)

export const twoFactorConfirmations = pgTable(
  "two_factor_confirmations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references((): AnyPgColumn => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueUserId: uniqueIndex("unique_user_id").on(table.userId),
  })
)
