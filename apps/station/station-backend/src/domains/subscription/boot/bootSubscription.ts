import type {
  IntentBus,
  SubscriptionRegistry,
} from "@marginal.credit/backend-framework";
import type { StationTopics } from "@marginal.credit/station-sdk";

import { CreateSubscriptionCommandHandler } from "../application/createSubscription.command";

export function bootSubscription(
  intentBus: IntentBus,
  subscriptionRegistry: SubscriptionRegistry<StationTopics>,
) {
  intentBus.register(
    new CreateSubscriptionCommandHandler(subscriptionRegistry),
  );
}
