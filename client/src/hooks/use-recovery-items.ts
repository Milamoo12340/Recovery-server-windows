import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw new Error(`Data validation failed for ${label}`);
  }
  return result.data;
}

export function useRecoveryItems() {
  return useQuery({
    queryKey: [api.recoveryItems.list.path],
    queryFn: async () => {
      const res = await fetch(api.recoveryItems.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch recovery items");
      const data = await res.json();
      return parseWithLogging(api.recoveryItems.list.responses[200], data, "recoveryItems.list");
    },
  });
}

export function useRecoveryItem(id: number) {
  return useQuery({
    queryKey: [api.recoveryItems.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.recoveryItems.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch recovery item");
      const data = await res.json();
      return parseWithLogging(api.recoveryItems.get.responses[200], data, "recoveryItems.get");
    },
    enabled: !!id,
  });
}
