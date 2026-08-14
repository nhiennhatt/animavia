CREATE TABLE "habit_backup_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"case" varchar(200) NOT NULL,
	"then" varchar(200) NOT NULL,
	"habit_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"logged_at" timestamp DEFAULT now(),
	"thought" text,
	"habit_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habit_statements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"statement" varchar(260) NOT NULL,
	"source" varchar(120),
	"habit_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habit_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"value" varchar(190) NOT NULL,
	"habit_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "habit_backup_plans" ADD CONSTRAINT "habit_backup_plans_habit_id_habits_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_habit_id_habits_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "habit_statements" ADD CONSTRAINT "habit_statements_habit_id_habits_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "habit_values" ADD CONSTRAINT "habit_values_habit_id_habits_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE;