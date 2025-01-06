CREATE TYPE "public"."roles" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"password" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"twoFactorEnabled" boolean DEFAULT false,
	"roles" "roles" DEFAULT 'user',
	"customerId" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
