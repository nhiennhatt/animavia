ALTER TABLE "habits" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "weekly_goal" smallint DEFAULT 7 NOT NULL;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "pinned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
DROP INDEX "owner_createdAt_idx";--> statement-breakpoint
CREATE INDEX "owner_createdAt_idx" ON "habits" ("owner_id","created_at" desc);