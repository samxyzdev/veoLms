ALTER TABLE "users" ALTER COLUMN "roles" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT ARRAY['student']::user_role[]::text;--> statement-breakpoint
DROP TYPE "public"."user_role";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'course_creator', 'admin');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT ARRAY['student']::user_role[]::"public"."user_role"[];--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "roles" SET DATA TYPE "public"."user_role"[] USING "roles"::"public"."user_role"[];--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "roles" "user_role"[] DEFAULT ARRAY['student']::user_role[] NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";