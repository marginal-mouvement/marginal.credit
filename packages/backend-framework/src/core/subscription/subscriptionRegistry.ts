import type { Topics } from "@marginal.credit/sdk";

import type { SubscriptionId } from "../value";
import { parallel } from "../concurrency";
import { ApplicationError } from "../error";
import type { DatetimeService } from "../misc";

type AnyHandler = (message: any) => Promise<void>;

interface Channel {
  handler: AnyHandler;
  token: symbol;
}

interface SubscriptionManifest {
  id: SubscriptionId;
  createdAt: number;
  attachedAt?: number;
  detachedAt?: number;
}

type TypedHandler<T extends Topics<any, any>> = (
  message: T[keyof T],
) => Promise<void>;

export class SubscriptionRegistry<T extends Topics<any, any>> {
  constructor(private readonly dateTimeService: DatetimeService) {}

  private static DetachedSubscriptionMaxAge = 1000 * 60;

  private readonly subscriptions = new Map<string, SubscriptionManifest>();
  private readonly channels = new Map<string, Channel>();
  private readonly topicToSubs = new Map<keyof T, Set<string>>();
  private readonly subToTopics = new Map<string, Set<keyof T>>();

  private cleanerTimeout: ReturnType<typeof setInterval> | undefined;

  registerSubscription(id: SubscriptionId) {
    this.subscriptions.set(id.serialize(), {
      id,
      createdAt: this.dateTimeService.now().getTime(),
    });
  }

  registerHandler(id: SubscriptionId, handler: TypedHandler<T>) {
    const token = Symbol();

    const subscriptionManifest = this.subscriptions.get(id.serialize());

    if (!subscriptionManifest) {
      throw ApplicationError.notFound("Subscription", id);
    }

    subscriptionManifest.detachedAt = undefined;
    subscriptionManifest.attachedAt = this.dateTimeService.now().getTime();

    this.channels.set(id.serialize(), {
      handler,
      token,
    });

    return token;
  }

  detachConnectionIfCurrent(id: SubscriptionId, token: symbol) {
    const subscriptionIdString = id.serialize();
    const current = this.channels.get(subscriptionIdString);

    if (current?.token !== token) {
      return;
    }

    this.channels.delete(subscriptionIdString);

    const subscriptionManifest = this.subscriptions.get(subscriptionIdString);

    if (subscriptionManifest) {
      subscriptionManifest.detachedAt = this.dateTimeService.now().getTime();
    }
  }

  deleteSubscription(id: SubscriptionId) {
    const subscriptionIdString = id.serialize();

    this.subscriptions.delete(subscriptionIdString);
    this.channels.delete(subscriptionIdString);

    const topics = this.subToTopics.get(subscriptionIdString);
    if (topics) {
      for (const topic of topics) {
        const subs = this.topicToSubs.get(topic);

        if (!subs) {
          continue;
        }

        subs.delete(subscriptionIdString);

        if (subs.size === 0) {
          this.topicToSubs.delete(topic);
        }
      }
    }

    this.subToTopics.delete(subscriptionIdString);
  }

  subscribe(topic: keyof T, id: SubscriptionId) {
    const subscriptionIdString = id.serialize();
    const subs = this.topicToSubs.get(topic) ?? new Set();
    subs.add(subscriptionIdString);
    this.topicToSubs.set(topic, subs);

    const topics = this.subToTopics.get(subscriptionIdString) ?? new Set();
    topics.add(topic);
    this.subToTopics.set(subscriptionIdString, topics);
  }

  unsubscribe(topic: keyof T, subscriptionId: SubscriptionId) {
    const subscriptionIdString = subscriptionId.serialize();
    const topics = this.subToTopics.get(subscriptionIdString);

    if (topics) {
      topics?.delete(topic);
      if (topics.size === 0) {
        this.subToTopics.delete(subscriptionIdString);
      }
    }

    const subs = this.topicToSubs.get(topic);

    if (subs) {
      subs.delete(subscriptionIdString);

      if (subs.size === 0) {
        this.topicToSubs.delete(topic);
      }
    }
  }

  clean() {
    const now = this.dateTimeService.now().getTime();

    for (const subscriptionManifest of this.subscriptions.values()) {
      if (!subscriptionManifest.detachedAt) {
        return;
      }

      if (
        now - subscriptionManifest.detachedAt >=
        SubscriptionRegistry.DetachedSubscriptionMaxAge
      ) {
        this.deleteSubscription(subscriptionManifest.id);
      }
    }
  }

  configureCleanCrawler(interval: number) {
    if (this.cleanerTimeout) {
      return;
    }

    const timeout = setInterval(() => this.clean(), interval);

    this.cleanerTimeout = timeout;

    return timeout;
  }

  async publish<TargetedTopics extends keyof T>(
    topics: Array<TargetedTopics>,
    event: T[TargetedTopics],
  ) {
    const recipients = new Set<string>();

    for (const topic of topics) {
      const subs = this.topicToSubs.get(topic);
      if (!subs) continue;
      for (const id of subs) recipients.add(id);
    }

    await parallel(recipients, 20, async (id) => {
      const handlerManifest = this.channels.get(id);
      await handlerManifest?.handler?.(event);
    });
  }
}
