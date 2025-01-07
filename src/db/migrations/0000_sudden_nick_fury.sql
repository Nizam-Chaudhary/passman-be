CREATE TABLE IF NOT EXISTS "passwords" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"username" varchar(255),
	"email" varchar(255),
	"password" varchar(255) NOT NULL,
	"iv" varchar(255) NOT NULL,
	"app_name" varchar(255),
	"base_url" varchar(255),
	"specific_url" varchar(255),
	"favicon_url" varchar(255),
	"notes" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"master_key" varchar(255) NOT NULL,
	"recovery_master_key" varchar(255) NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"otp" varchar(6) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passwords" ADD CONSTRAINT "passwords_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
