// client.ts
import { treaty } from "@elysiajs/eden";
import type { App } from "pgrid-be/app";
import { createContext, useContext } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3001";

console.log("BACKEND_URL..", BACKEND_URL);

const client = treaty<App>(BACKEND_URL, {
  fetch: {
    credentials: "include",
  },
});

type ElysiaClientType = typeof client;

const ElysiaClientContext = createContext<ElysiaClientType | null>(null);

export function ElysiaClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ElysiaClientContext.Provider value={client}>
      {children}
    </ElysiaClientContext.Provider>
  );
}

export function useElysiaClient() {
  const client = useContext(ElysiaClientContext)

  if (!client) {
    throw new Error(
      "useElysiaClient must be used inside ElysiaClientProvider"
    )
  }

  return client
}