import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { config } from "dotenv"
import * as schema from "@/server/db/schema" // The schema defining tables and relationships

// config({ path: ".env" }) // or .env.local

const sql = neon(process.env.DATABASE_URL!)
// export const db = drizzle({ client: sql })

// --- only import and use for db.query aporoach
// for sql like use no need, just export like above
export const db = drizzle(sql, {
  schema: schema, // Associate schema with the ORM instance
  logger: true, // Enable query logging for debugging
})
