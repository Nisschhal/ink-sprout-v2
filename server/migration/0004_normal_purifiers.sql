ALTER TABLE "products" ADD COLUMN "userId" text;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;