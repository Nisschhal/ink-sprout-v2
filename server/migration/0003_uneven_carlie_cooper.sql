CREATE TABLE "orderProduct" (
	"id" serial PRIMARY KEY NOT NULL,
	"quantity" integer NOT NULL,
	"productVariantId" serial NOT NULL,
	"orderId" serial NOT NULL,
	"productId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"total" real NOT NULL,
	"status" text NOT NULL,
	"created" timestamp DEFAULT now(),
	"receiptURL" text,
	"paymentIntentId" text
);
--> statement-breakpoint
ALTER TABLE "orderProduct" ADD CONSTRAINT "orderProduct_productVariantId_productVariants_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderProduct" ADD CONSTRAINT "orderProduct_orderId_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderProduct" ADD CONSTRAINT "orderProduct_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;