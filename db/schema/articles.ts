import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const articles = pgTable("articles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  keywords: text("keywords").notNull(),
  settings: jsonb("settings").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => ({
  userIdIdx: index("articles_user_id_idx").on(table.userId),
  createdAtIdx: index("articles_created_at_idx").on(table.createdAt),
}));

export type ArticleSettings = {
  articleType: string;
  articleSize: string;
  tone: string;
  pointOfView: string;
  readability: string;
  aiCleaning: string;
  structure: {
    conclusion: boolean;
    faqSection: boolean;
    tables: boolean;
    h3Headings: boolean;
    lists: boolean;
    italics: boolean;
    bold: boolean;
    quotes: boolean;
    keyTakeaways: boolean;
  };
  language: string;
};

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;