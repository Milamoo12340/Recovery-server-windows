import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const recoveryItems = pgTable("recovery_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // e.g., 'wim', 'script', 'winpe', 'folder', 'dll'
  size: text("size").notNull(),
  path: text("path").notNull(),
  instructions: text("instructions").notNull(),
});

export const insertRecoveryItemSchema = createInsertSchema(recoveryItems).omit({ id: true });
export type RecoveryItem = typeof recoveryItems.$inferSelect;
export type InsertRecoveryItem = z.infer<typeof insertRecoveryItemSchema>;

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
