ALTER TABLE "habit_logs" ADD COLUMN "for_date" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "timezone" varchar(50) DEFAULT 'Asia/Ho_Chi_Minh' NOT NULL;--> statement-breakpoint
ALTER TABLE "habit_logs" ALTER COLUMN "logged_at" SET NOT NULL;