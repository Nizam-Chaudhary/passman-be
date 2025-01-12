ALTER TABLE "passwords" RENAME COLUMN "app_name" TO "site";--> statement-breakpoint
ALTER TABLE "passwords" RENAME COLUMN "notes" TO "note";--> statement-breakpoint
ALTER TABLE "passwords" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "passwords" ALTER COLUMN "password" SET DATA TYPE json USING password::json;--> statement-breakpoint
ALTER TABLE "passwords" ALTER COLUMN "site" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "master_key" SET DATA TYPE json USING master_key::json;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "recovery_master_key" SET DATA TYPE json USING recovery_master_key::json;--> statement-breakpoint
ALTER TABLE "passwords" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "passwords" DROP COLUMN IF EXISTS "iv";--> statement-breakpoint
ALTER TABLE "passwords" DROP COLUMN IF EXISTS "base_url";--> statement-breakpoint
ALTER TABLE "passwords" DROP COLUMN IF EXISTS "specific_url";
