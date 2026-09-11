import {
  type HonoRouter,
  type InMemoryIntentBus,
  KeyId,
  UserId,
} from "@marginal.credit/backend-framework";
import { UserApi } from "@marginal.credit/platform-sdk";

import type { Actor } from "../../auth/domain/actor";
import { UserByKeyQuery } from "../application/queries/userByKey.query";
import { MeQuery } from "../application/queries/me.query";
import { HttpUserSerializer } from "../infra/http.user.serializer";
import { ClaimKeyCommand } from "../application/commands/claimKey.command";
import { Email } from "../domain/email";
import { CreditUserBalanceCommand } from "../application/commands/creditUserBalance.command";
import { DebitUserBalanceCommand } from "../application/commands/debitUserBalance.command";

export function bootUserRoutes(
  router: HonoRouter<Actor>,
  intentBus: InMemoryIntentBus,
) {
  const userPresenter = new HttpUserSerializer();

  router.routeWithoutAuth(UserApi.ClaimKey, async (payload) => {
    return userPresenter.serializeUser(
      await intentBus.handle(
        new ClaimKeyCommand({
          email: Email.deserialize(payload.email),
          refererName: payload.refererName,
          name: payload.name,
          keyId: KeyId.parse(payload.keyId),
        }),
      ),
    );
  });

  router.routeWithAuth(UserApi.Me, async (_, actor) => {
    return userPresenter.serializeUser(
      await intentBus.handle(
        new MeQuery({
          actor,
        }),
      ),
    );
  });

  router.routeWithAuth(UserApi.GetByKey, async (payload, actor) => {
    return userPresenter.serializeUser(
      await intentBus.handle(
        new UserByKeyQuery({
          actor,
          keyId: KeyId.parse(payload.keyId),
        }),
      ),
    );
  });

  router.routeWithAuth(UserApi.Credit, async (payload, actor) => {
    await intentBus.handle(
      new CreditUserBalanceCommand({
        actor,
        amount: payload.amount,
        userId: UserId.parse(payload.userId),
        transfer: {
          label: payload.label,
          thumbnailUrl: payload.thumbnailUrl,
        },
      }),
    );
  });

  router.routeWithAuth(UserApi.Debit, async (payload, actor) => {
    await intentBus.handle(
      new DebitUserBalanceCommand({
        actor,
        amount: payload.amount,
        userId: UserId.parse(payload.userId),
        transfer: {
          label: payload.label,
          thumbnailUrl: payload.thumbnailUrl,
        },
      }),
    );
  });
}
