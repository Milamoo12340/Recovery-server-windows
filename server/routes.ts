import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { registerChatRoutes } from "./replit_integrations/chat/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register AI chat routes (handles /api/conversations and messages)
  registerChatRoutes(app);

  app.get(api.recoveryItems.list.path, async (req, res) => {
    const items = await storage.getRecoveryItems();
    res.json(items);
  });

  app.get(api.recoveryItems.get.path, async (req, res) => {
    const item = await storage.getRecoveryItem(Number(req.params.id));
    if (!item) {
      return res.status(404).json({ message: "Recovery item not found" });
    }
    res.json(item);
  });

  return httpServer;
}
