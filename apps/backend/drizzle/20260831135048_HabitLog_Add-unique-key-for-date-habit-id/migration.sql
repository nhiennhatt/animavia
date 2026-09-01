DROP INDEX "habit_logs_habit_id_for_date";--> statement-breakpoint
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_habit_id_for_date" UNIQUE("habit_id","for_date");