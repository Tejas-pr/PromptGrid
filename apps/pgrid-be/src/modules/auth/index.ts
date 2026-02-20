import type { Context } from "elysia";
import { auth } from "@pgrid/auth/auth";

const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"] as const;

export const betterAuthView = ({ request, set }: Context) => {
  if (BETTER_AUTH_ACCEPT_METHODS.includes(request.method as any)) {
    return auth.handler(request);
  }

  set.status = 405;
  return {
    error: "Method Not Allowed",
  };
};