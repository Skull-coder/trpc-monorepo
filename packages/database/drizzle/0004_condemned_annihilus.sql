ALTER TABLE "forms" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "form_fields" ALTER COLUMN "form_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "form_fields" ALTER COLUMN "index" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "form_fields" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "form_fields" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "form_fields" ALTER COLUMN "updated_at" SET NOT NULL;