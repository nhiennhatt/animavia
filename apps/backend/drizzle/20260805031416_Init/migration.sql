CREATE TYPE "user_status_enum" AS ENUM('STATUS_024', 'STATUS_820', 'STATUS_295');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" varchar(50) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"status" "user_status_enum" DEFAULT 'STATUS_024'::"user_status_enum" NOT NULL
);
