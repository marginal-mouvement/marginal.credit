import { SDK } from "@marginal.credit/sdk";

import type { AnyStationSnapshot } from "./station.topics";
import { AnyStationSnapshotSchema } from "./station.topics";
import { SubscriptionApi } from "./subscription.api";

export class StationSDK extends SDK {
  constructor(baseUrl: string) {
    super(baseUrl);
  }
  prepareHeaders(): HeadersInit {
    return {};
  }

  async subscribe(callback: (snapshot: AnyStationSnapshot) => void) {
    const { unsubscribe, subscriptionId } = await this.useSubscription(
      SubscriptionApi.Create,
      AnyStationSnapshotSchema,
      callback,
    );

    return { unsubscribe, subscriptionId };
  }
}
