ALTER TABLE "users" DROP CONSTRAINT "users_fileId_files_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_fileId_files_id_fk" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;