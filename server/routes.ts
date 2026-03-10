import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { registerChatRoutes } from "./replit_integrations/chat/routes";

function getServerInfo(req: any) {
  // Get the actual host from the request (this works on any platform)
  const protocol = req.protocol || 'http';
  const hostname = req.get('host') || req.hostname || 'localhost:5000';
  const serverUrl = `${protocol}://${hostname}`;
  
  // For IP address, try to detect from various sources
  // On Vercel: API routes don't have a direct IP, so we use the hostname
  // On Replit: we can get the internal IP
  const internalIp = process.env.REPL_INTERNAL_IP || req.ip || 'see server url above';
  
  // Extract port from hostname if present, otherwise use environment port
  let port = 5000;
  if (hostname.includes(':')) {
    const portStr = hostname.split(':')[1];
    port = parseInt(portStr, 10) || 5000;
  } else {
    port = parseInt(process.env.PORT || '5000', 10);
  }
  
  return {
    serverUrl,
    serverIp: internalIp,
    port,
    isDeployed: !hostname.includes('localhost'),
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
    const serverInfo = getServerInfo(req);
    res.json(serverInfo);
  });

  // Health check endpoint - lets clients verify the server is reachable
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      message: "Recovery server is online and accessible"
    });
  });

  // Serve repository files via API route to ensure they're accessible
  app.use('/repository', express.static(path.join(process.cwd(), 'repository')));

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
