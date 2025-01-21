//-----Next-Auth---- docs might used AdapterAccoutType so rename it to AdapterAccount
import type { AdapterAccount } from "next-auth/adapters"

import {
  AnyPgColumn,
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

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

// Product ======= Variant ========= Reviews ==========

// ------ PRODUCT MODEL: Represents a product available in the store
export const products = pgTable("products", {
  id: serial("id").primaryKey(), // Unique identifier for the product
  description: text("description").notNull(), // Product description
  title: text("title").notNull(), // Product title
  created: timestamp("created").defaultNow(), // Timestamp when the product was created
  price: real("price").notNull(), // Product price
  createdBy: text("userId").references(() => users.id, { onDelete: "cascade" }),
})

// --------- PRODUCT VARIANTS MODEL: Represents different variations of a product (e.g., color, size)
export const productVariants = pgTable("productVariants", {
  id: serial("id").primaryKey(), // Unique identifier for the variant
  color: text("color").notNull(), // Color of the variant
  productType: text("productType").notNull(), // Type of product variant (e.g., size, style)
  updated: timestamp("updated").defaultNow(), // Timestamp when the variant was last updated
  productId: serial("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }), // References the product this variant belongs to
})

// --------- Variant Images Model: Stores images associated with a product variant
export const variantImages = pgTable("variantImages", {
  id: serial("id").primaryKey(), // Unique identifier for the image
  url: text("url").notNull(), // Image URL
  size: real("size").notNull(), // Image size
  name: text("name").notNull(), // Image file name
  order: real("order").notNull(), // Order in which the image should be displayed
  variantId: serial("variantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }), // References the variant this image belongs to
})

// --------- Variant Tags Model: Stores tags associated with a product variant
export const variantTags = pgTable("variantTags", {
  id: serial("id").primaryKey(), // Unique identifier for the tag
  tag: text("tag").notNull(), // Tag associated with the variant
  variantId: serial("variantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }), // References the variant the tag belongs to
})

// ~~~~~~~~~~~~~~~~  Relations ~~~~~~~~~~~~~~~~~ //

// PRODUCTS RELATION to reviews and variants (one-to-many relation)
export const productRelations = relations(products, ({ many, one }) => ({
  productVariants: many(productVariants, { relationName: "productVariants" }), // One product has many variants
  reviews: many(reviews, { relationName: "reviews" }), // One product has many reviews
  users: one(users, {
    relationName: "productUsers",
    fields: [products.createdBy],
    references: [users.id],
  }),
}))

// PRODUCT VARIANTS RELATION to product and variant images/tags (one-to-one and one-to-many relations)
export const productVariantsRelations = relations(
  productVariants,
  ({ many, one }) => ({
    products: one(products, {
      relationName: "productVariants", // One product variant corresponds to one product
      fields: [productVariants.productId],
      references: [products.id],
    }),
    variantImages: many(variantImages, { relationName: "variantImages" }), // One variant can have many images
    variantTags: many(variantTags, { relationName: "variantTags" }), // One variant can have many tags
  })
)

// Variant Images Relation to productVariant (one-to-one relation)
export const variantImageRelations = relations(variantImages, ({ one }) => ({
  productVariants: one(productVariants, {
    relationName: "variantImages",
    fields: [variantImages.variantId],
    references: [productVariants.id],
  }),
}))

// Variant Tags Relation to productVariant (one-to-one relation)
export const variantTagsRelation = relations(variantTags, ({ one }) => ({
  productVariants: one(productVariants, {
    relationName: "variantTags",
    fields: [variantTags.variantId],
    references: [productVariants.id],
  }),
}))

// ---------  REVIEW MODEL: Represents a review for a product
export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(), // Unique identifier for the review
    rating: real("rating").notNull(), // Rating value (e.g., 1-5 stars)
    comment: text("comment").notNull(), // Review comment
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Reference to the user who left the review
    productId: serial("productId")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }), // Reference to the product being reviewed
    created: timestamp("created").defaultNow(), // Timestamp when the review was created
  },
  (table) => {
    return {
      productIdx: index("productIdx").on(table.productId), // Index for productId
      userIdx: index("userIdx").on(table.userId), // Index for userId
    }
  }
)

// ~~~~~~~~~~~~~ Review Relation to User and Product ~~~~~~~~~~~~~~`
export const reviewRelations = relations(reviews, ({ one }) => ({
  users: one(users, {
    fields: [reviews.userId],
    references: [users.id],
    relationName: "user_reviews", // Relation between review and user
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
    relationName: "reviews", // Relation between review and product
  }),
}))

// ORDER MODEL: Represents an order placed by a user

//------------- MODEL Order
export const orders = pgTable("order", {
  id: serial("id").primaryKey(), // Generates a unique id for each order, set as the primary key.
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Links the order to a specific user by referencing their id. Ensures that if the user is deleted, all related orders are also deleted (cascade).
  total: real("total").notNull(), // Represents the total amount of the order, marked as not nullable to ensure every order has a total amount.
  status: text("status").notNull(), // Indicates the status of the order (e.g., "pending", "completed"), ensuring that every order has a valid status.
  created: timestamp("created").defaultNow(), // Automatically stores the timestamp when the order is created, defaulting to the current date and time.
  receiptURL: text("receiptURL"), // Stores an optional URL for the order's receipt.
  paymentIntentId: text("paymentIntentId"), // Holds the unique ID related to the payment intent (used by services like Stripe to track payments).
})

//Relation with User and orderProduct
export const ordersRelations = relations(orders, ({ one, many }) => ({
  users: one(users, {
    fields: [orders.userId],
    references: [users.id],
    relationName: "user_orders", // Creates a one-to-one relationship with the users table, ensuring that each order is linked to a single user.
  }),
  orderProduct: many(orderProduct, {
    relationName: "orderProduct", // Creates a one-to-many relationship with the orderProduct table, allowing multiple products per order.
  }),
}))

// -------- MODEL OrderProduct
// get the product, and productVariant based on their id
export const orderProduct = pgTable("orderProduct", {
  id: serial("id").primaryKey(), // Generates a unique id for each order-product entry, set as the primary key.
  quantity: integer("quantity").notNull(), // Represents the quantity of the product ordered, marked as not nullable to ensure each entry specifies a quantity.
  productVariantId: serial("productVariantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }), // Links to the specific product variant ordered. Cascade delete ensures the entry is removed if the product variant is deleted.
  orderId: serial("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }), // References the order that the product belongs to. Cascade delete ensures the entry is removed if the order is deleted.
  productId: serial("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }), // References the product associated with the order-product entry. Cascade delete ensures the entry is removed if the product is deleted.
})

// OrderProduct Relation to order, products, and productVariant
export const OrderProductRelations = relations(orderProduct, ({ one }) => ({
  orders: one(orders, {
    fields: [orderProduct.orderId],
    references: [orders.id],
    relationName: "orderProduct", // Creates a one-to-one relationship with the orders table, linking each order-product entry to a specific order.
  }),
  products: one(products, {
    fields: [orderProduct.productId],
    references: [products.id],
    relationName: "products", // Creates a one-to-one relationship with the products table, linking each order-product entry to a specific product.
  }),
  productVariants: one(productVariants, {
    fields: [orderProduct.productVariantId],
    references: [productVariants.id],
    relationName: "productVariants", // Creates a one-to-one relationship with the productVariants table, linking each order-product entry to a specific product variant.
  }),
}))

// ---------------------
