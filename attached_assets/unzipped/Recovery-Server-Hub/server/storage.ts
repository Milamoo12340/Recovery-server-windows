import { db } from "./db";
import { recoveryItems, type RecoveryItem, type InsertRecoveryItem } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getRecoveryItems(): Promise<RecoveryItem[]>;
  getRecoveryItem(id: number): Promise<RecoveryItem | undefined>;
  createRecoveryItem(item: InsertRecoveryItem): Promise<RecoveryItem>;
}

export class DatabaseStorage implements IStorage {
  async getRecoveryItems(): Promise<RecoveryItem[]> {
    return await db.select().from(recoveryItems);
  }

  async getRecoveryItem(id: number): Promise<RecoveryItem | undefined> {
    const [item] = await db.select().from(recoveryItems).where(eq(recoveryItems.id, id));
    return item;
  }

  async createRecoveryItem(item: InsertRecoveryItem): Promise<RecoveryItem> {
    const [created] = await db.insert(recoveryItems).values(item).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
