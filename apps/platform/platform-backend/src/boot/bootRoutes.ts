import {
  HonoRouter,
  type InMemoryIntentBus,
} from "@marginal.credit/backend-framework";
import type { Context } from "hono";
import { Hono } from "hono";

import type { Actor } from "../domains/auth/domain/actor";
import { bootUserRoutes } from "../domains/user/boot/bootUserRoutes";
import { bootKeyRoutes } from "../domains/key/boot/bootKeyRoutes";
import { bootShowRoutes } from "../domains/show/boot/bootShowRoutes";
import { bootTransferRoutes } from "../domains/transfer/boot/bootTransferRoutes";

export function bootRoutes(
  intentBus: InMemoryIntentBus,
  authenticateFunction: (ctx: Context) => Promise<Actor>,
) {
  const hono = new Hono();
  const router = new HonoRouter(hono, authenticateFunction);

  bootUserRoutes(router, intentBus);

  bootKeyRoutes(router, intentBus);

  bootShowRoutes(router, intentBus);

  bootTransferRoutes(router, intentBus);

  return hono;
}
