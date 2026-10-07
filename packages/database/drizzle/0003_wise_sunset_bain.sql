CREATE TYPE "public"."content_type" AS ENUM('video', 'article', 'resource');--> statement-breakpoint
CREATE TYPE "public"."otp_purpose" AS ENUM('email_verification', 'forgot_password');--> statement-breakpoint
ALTER TABLE "cart" DROP CONSTRAINT "cart_user";--> statement-breakpoint
ALTER TABLE "oauth_account_table" DROP CONSTRAINT "oauth_account_table_provider_provider_account_id_unique";--> statement-breakpoint
ALTER TABLE "cart" DROP CONSTRAINT "cart_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "cart" DROP CONSTRAINT "cart_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "content_progress" DROP CONSTRAINT "content_progress_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "content_progress" DROP CONSTRAINT "content_progress_content_id_course_contents_id_fk";
--> statement-breakpoint
ALTER TABLE "course_contents" DROP CONSTRAINT "course_contents_section_id_course_sections_id_fk";
--> statement-breakpoint
ALTER TABLE "course_progress" DROP CONSTRAINT "course_progress_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "course_progress" DROP CONSTRAINT "course_progress_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "course_progress" DROP CONSTRAINT "course_progress_last_content_id_course_contents_id_fk";
--> statement-breakpoint
ALTER TABLE "course_sections" DROP CONSTRAINT "course_sections_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_activity" DROP CONSTRAINT "user_activity_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_goals" DROP CONSTRAINT "user_goals_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "session_userId_idx";--> statement-breakpoint
ALTER TABLE "course_contents" ALTER COLUMN "content_type" SET DATA TYPE "public"."content_type" USING "content_type"::"public"."content_type";--> statement-breakpoint
ALTER TABLE "oauth_account_table" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "oauth_account_table" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "oauth_account_table" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "oauth_account_table" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "token" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "otp" ADD COLUMN "otp_hash" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "otp" ADD COLUMN "purpose" "otp_purpose" DEFAULT 'email_verification' NOT NULL;--> statement-breakpoint
ALTER TABLE "otp" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "otp" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "otp" ADD COLUMN "expires_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "otp" ADD COLUMN "used_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "otp" ADD COLUMN "attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "expires_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_progress" ADD CONSTRAINT "content_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_progress" ADD CONSTRAINT "content_progress_content_id_course_contents_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."course_contents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_contents" ADD CONSTRAINT "course_contents_section_id_course_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."course_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_last_content_id_course_contents_id_fk" FOREIGN KEY ("last_content_id") REFERENCES "public"."course_contents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_sections" ADD CONSTRAINT "course_sections_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_goals" ADD CONSTRAINT "user_goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cart_user_id_idx" ON "cart" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_course_id_idx" ON "cart" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "course_contents_section_id_idx" ON "course_contents" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "course_purchase_user_id_idx" ON "course_purchase" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "course_purchase_course_id_idx" ON "course_purchase" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "course_sections_course_id_idx" ON "course_sections" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "courses_category_status_idx" ON "courses" USING btree ("category_id","status");--> statement-breakpoint
CREATE INDEX "oauth_accounts_user_id_idx" ON "oauth_account_table" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "otp_email_purpose_idx" ON "otp" USING btree ("email","purpose");--> statement-breakpoint
CREATE INDEX "otp_expires_at_idx" ON "otp" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "reviews_course_id_idx" ON "reviews" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "reviews_user_id_idx" ON "reviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_expires_at_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "transactions_user_id_idx" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transactions_course_id_idx" ON "transactions" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "transactions_status_idx" ON "transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "learning_outcomes";--> statement-breakpoint
ALTER TABLE "otp" DROP COLUMN "hashOtp";--> statement-breakpoint
ALTER TABLE "otp" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "otp" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "otp" DROP COLUMN "expiresAt";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "expiresAt";--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_course_unique" UNIQUE("user_id","course_id");--> statement-breakpoint
ALTER TABLE "course_contents" ADD CONSTRAINT "section_content_sequence_unique" UNIQUE("section_id","sequence_order");--> statement-breakpoint
ALTER TABLE "course_learning_outcomes" ADD CONSTRAINT "course_learning_outcome_sequence_unique" UNIQUE("course_id","sequence_order");--> statement-breakpoint
ALTER TABLE "course_sections" ADD CONSTRAINT "course_section_sequence_unique" UNIQUE("course_id","sequence_order");--> statement-breakpoint
ALTER TABLE "oauth_account_table" ADD CONSTRAINT "oauth_provider_account_unique" UNIQUE("provider","provider_account_id");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payment_gateway_id_unique" UNIQUE("payment_gateway_id");--> statement-breakpoint
ALTER TABLE "content_progress" ADD CONSTRAINT "content_progress_watched_seconds_check" CHECK ("content_progress"."watched_seconds" >= 0);--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_percentage_check" CHECK ("course_progress"."progress_percentage" >= 0 AND "course_progress"."progress_percentage" <= 100);--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_price_non_negative_check" CHECK ("courses"."price" IS NULL OR "courses"."price" >= 0);--> statement-breakpoint
ALTER TABLE "otp" ADD CONSTRAINT "otp_attempts_non_negative_check" CHECK ("otp"."attempts" >= 0);--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rating_check" CHECK ("reviews"."rating" >= 1 AND "reviews"."rating" <= 5);--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_amount_non_negative_check" CHECK ("transactions"."amount_paid" >= 0);--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_minutes_non_negative_check" CHECK ("user_activity"."minutes_studied" >= 0);--> statement-breakpoint
ALTER TABLE "user_goals" ADD CONSTRAINT "user_goals_target_minutes_check" CHECK ("user_goals"."target_minutes" >= 0);--> statement-breakpoint
ALTER TABLE "user_goals" ADD CONSTRAINT "user_goals_week_range_check" CHECK ("user_goals"."week_end" >= "user_goals"."week_start");