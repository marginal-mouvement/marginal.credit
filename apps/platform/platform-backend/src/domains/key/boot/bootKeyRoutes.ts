import {
  type HonoRouter,
  type InMemoryIntentBus,
  KeyId,
} from "@marginal.credit/backend-framework";
import { KeyApi } from "@marginal.credit/platform-sdk";

import type { Actor } from "../../auth/domain/actor";
import { CreateKeyCommand } from "../application/commands/createKey.command";
import { ShowId } from "../../show/domain/showId";
import { IsKeyAvailableQuery } from "../application/commands/isKeyAvailable.query";

export function bootKeyRoutes(
  router: HonoRouter<Actor>,
  intentBus: InMemoryIntentBus,
) {
  router.routeWithAuth(KeyApi.Create, async (payload, actor) => {
    const { id } = await intentBus.handle(
      new CreateKeyCommand({
        actor,
        showId: payload.showId ? ShowId.parse(payload.showId) : undefined,
      }),
    );

    return { keyId: id.serialize() };
  });

  router.routeWithoutAuth(KeyApi.IsAvailable, async (payload) => {
    return intentBus.handle(
      new IsKeyAvailableQuery({
        keyId: KeyId.parse(payload.keyId),
      }),
    );
  });
}
