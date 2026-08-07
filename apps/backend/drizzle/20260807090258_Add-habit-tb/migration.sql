CREATE TYPE "habit_type_enum" AS ENUM('HTYPE_235', 'HTYPE_834');--> statement-breakpoint
CREATE TYPE "life_domain_enum" AS ENUM('DOMAIN_364', 'DOMAIN_247', 'DOMAIN_584', 'DOMAIN_953', 'DOMAIN_424', 'DOMAIN_744', 'DOMAIN_929');--> statement-breakpoint
CREATE TABLE "habits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(120) NOT NULL,
	"objective" varchar(360),
	"htype" "habit_type_enum" NOT NULL,
	"domain" "life_domain_enum"[] DEFAULT '{}'::"life_domain_enum"[],
	"owner_id" uuid NOT NULL
);
