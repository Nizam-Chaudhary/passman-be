ALTER TABLE "users" ALTER COLUMN "master_key" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "recovery_master_key" DROP NOT NULL;