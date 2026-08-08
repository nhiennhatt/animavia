DROP INDEX "owner_createdAt_idx";--> statement-breakpoint
CREATE INDEX "owner_createdAt_idx" ON "habits" ("owner_id","createdAt" desc);