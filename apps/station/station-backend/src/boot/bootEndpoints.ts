import { Hono } from "hono";
import type {
  IntentBus,
  SubscriptionRegistry,
} from "@marginal.credit/backend-framework";
import { HonoRouter, KeyId, UserId } from "@marginal.credit/backend-framework";
import type { StationTopics } from "@marginal.credit/station-sdk";
import { ReaderApi, SubscriptionApi } from "@marginal.credit/station-sdk";

import type { ReaderManager } from "../domains/reader/infra/readerManager";
import { ReaderId } from "../domains/reader/domain/readerId";
import { CreateSubscriptionCommand } from "../domains/subscription/application/createSubscription.command";

export function bootEndpoints(
  readerManager: ReaderManager,
  subscriptionRegistry: SubscriptionRegistry<StationTopics>,
  intentBus: IntentBus,
) {
  const hono = new Hono();

  const router = new HonoRouter(hono, async () => ({
    id: UserId.station(),
  }));

  router.routeWithoutAuth(ReaderApi.WriteKeyId, async (payload) => {
    await readerManager.write(
      ReaderId.parse(payload.readerId),
      KeyId.parse(payload.keyId),
    );
  });

  router.routeWithoutAuth(ReaderApi.GetAll, async () => {
    return { readers: readerManager.getReaders() };
  });

  router.routeWithoutAuth(SubscriptionApi.Create, async () => {
    const { subscriptionId } = await intentBus.handle(
      new CreateSubscriptionCommand({}),
    );

    return {
      subscriptionId: subscriptionId.serialize(),
    };
  });

  router.subscription(subscriptionRegistry, ["reader*"]);

  return hono;
}
