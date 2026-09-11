import type {
  NodeDatetimeService,
  SubscriptionRegistry,
} from "@marginal.credit/backend-framework";
import { Environment } from "@marginal.credit/backend-framework";
import type { StationTopics } from "@marginal.credit/station-sdk";
import PCSC from "@tockawa/nfc-pcsc";

import { ReaderManager } from "../infra/readerManager";
import { UriPrefix } from "../infra/utils/uriPrefix";

export function bootReader(
  dateTimeService: NodeDatetimeService,
  subscriptionRegistry: SubscriptionRegistry<StationTopics>,
) {
  const readerManager = new ReaderManager(
    Environment.get("URI_PREFIX") === "https"
      ? UriPrefix.HTTPS
      : UriPrefix.HTTP,
    Environment.get("KEY_PATH"),
    subscriptionRegistry,
    dateTimeService,
  );

  const pcsc = new PCSC();

  pcsc.on("reader", (reader) => {
    readerManager.register(reader).catch(console.error);
  });

  return { readerManager };
}
