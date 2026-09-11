import {
  SubscriptionId,
  type SubscriptionRegistry,
  CommandHandler,
  Command,
  UserId,
} from "@marginal.credit/backend-framework";
import type { StationTopics } from "@marginal.credit/station-sdk";

export class CreateSubscriptionCommand extends Command<{
  subscriptionId: SubscriptionId;
}> {
  constructor(readonly payload: Record<string, never>) {
    super();
  }
}

export class CreateSubscriptionCommandHandler extends CommandHandler(
  CreateSubscriptionCommand,
) {
  constructor(
    private readonly subscriptionRegistry: SubscriptionRegistry<StationTopics>,
  ) {
    super();
  }

  async execute() {
    const subscriptionId = SubscriptionId.for(UserId.station());

    this.subscriptionRegistry.registerSubscription(subscriptionId);

    return { subscriptionId };
  }
}
