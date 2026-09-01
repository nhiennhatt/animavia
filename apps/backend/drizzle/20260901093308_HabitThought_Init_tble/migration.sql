CREATE TABLE "habit_thoughts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"logged_at" timestamp DEFAULT now() NOT NULL,
	"for_date" timestamp DEFAULT now() NOT NULL,
	"habit_id" uuid NOT NULL,
	"thought" text NOT NULL,
	CONSTRAINT "habit_thoughts_habit_id_for_date" UNIQUE("habit_id","for_date")
);
--> statement-breakpoint
ALTER TABLE "habit_logs" DROP COLUMN "thought";--> statement-breakpoint
ALTER TABLE "habit_thoughts" ADD CONSTRAINT "habit_thoughts_habit_id_habits_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE;