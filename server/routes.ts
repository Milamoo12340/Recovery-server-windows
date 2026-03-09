import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { registerChatRoutes } from "./replit_integrations/chat/routes";

function getServerInfo() {
  const host = process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.replit.dev` : 'http://localhost:5000';
  const ip = process.env.REPL_INTERNAL_IP || process.env.HOSTNAME || 'localhost';
  const port = parseInt(process.env.PORT || '5000', 10);
  
  return {
    serverUrl: host,
    serverIp: ip,
    port: port,
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register AI chat routes (handles /api/conversations and messages)
  registerChatRoutes(app);

  // Server info endpoint - provides connection details for recovery
  app.get("/api/server-info", (req, res) => {
    const serverInfo = getServerInfo();
    res.json(serverInfo);
  });

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
