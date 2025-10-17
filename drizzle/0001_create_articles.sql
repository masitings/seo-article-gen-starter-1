-- Create articles table
CREATE TABLE IF NOT EXISTS "articles" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "settings" JSONB NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "articles_user_id_idx" ON "articles" ("user_id");
CREATE INDEX IF NOT EXISTS "articles_created_at_idx" ON "articles" ("created_at");

-- Add foreign key constraint
ALTER TABLE "articles" ADD CONSTRAINT "articles_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;