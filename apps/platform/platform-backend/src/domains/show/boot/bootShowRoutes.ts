import type {
  HonoRouter,
  InMemoryIntentBus,
} from "@marginal.credit/backend-framework";
import { ShowApi } from "@marginal.credit/platform-sdk";

import type { Actor } from "../../auth/domain/actor";
import { CreateShowCommand } from "../applicatioin/commands/createShow.command";
import { HttpShowSerializer } from "../infra/http.show.serializer";
import { AllShowsQuery } from "../applicatioin/queries/allShows.query";

export function bootShowRoutes(
  router: HonoRouter<Actor>,
  intentBus: InMemoryIntentBus,
) {
  const showPresenter = new HttpShowSerializer();

  router.routeWithAuth(ShowApi.Create, async (payload, actor) => {
    const show = await intentBus.handle(
      new CreateShowCommand({
        actor,
        name: payload.name,
        reward: payload.reward,
        date: payload.date,
        thumbnailUrl: payload.thumbnailUrl,
      }),
    );

    return showPresenter.serializeShow(show);
  });

  router.routeWithAuth(ShowApi.AllShows, async (_, actor) => {
    const shows = await intentBus.handle(new AllShowsQuery({ actor }));
    return showPresenter.serializeShows(shows);
  });
}
