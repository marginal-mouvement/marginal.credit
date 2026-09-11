import type { Reader } from "@tockawa/nfc-pcsc";
import type {
  KeyId,
  DatetimeService,
  SubscriptionRegistry,
} from "@marginal.credit/backend-framework";
import {
  InfrastructureError,
  Logger,
} from "@marginal.credit/backend-framework";
import type { StationTopics } from "@marginal.credit/station-sdk";

import type { UriPrefix } from "./utils/uriPrefix";
import { MarginalisedReader } from "./marginalisedReader";

import { ReaderSubscriptionEvent } from "../domain/readerSubscriptionEvent";
import type { ReaderId } from "../domain/readerId";

export class ReaderManager {
  constructor(
    private readonly uriPrefix: UriPrefix,
    private readonly path: string,
    private readonly subscriptionRegistry: SubscriptionRegistry<StationTopics>,
    private readonly dateTimeService: DatetimeService,
  ) {}

  private readonly readers: Map<string, MarginalisedReader> = new Map();

  private readonly logger = Logger.for("ReaderManager");

  async register(reader: Reader) {
    const now = this.dateTimeService.now();
    const marginalisedReader = MarginalisedReader.spawn(reader);
    this.readers.set(marginalisedReader.stringId, marginalisedReader);

    this.logger.info(`Registered reader "${marginalisedReader.name}"`);

    reader.on("card.on", () => this.onCardOn(marginalisedReader));
    reader.on("card.off", () => this.onCardOff(marginalisedReader));

    reader.on("error", (e) => {
      this.logger.error(`Reader '${marginalisedReader.name}'`, e);

      this.subscriptionRegistry.publish(
        ["reader*"],
        ReaderSubscriptionEvent.UnknownError(marginalisedReader.id, e, now),
      );
    });

    reader.on("end", () => this.unregister(marginalisedReader));

    await this.subscriptionRegistry.publish(
      ["reader*"],
      ReaderSubscriptionEvent.Connected(
        marginalisedReader.id,
        marginalisedReader.name,
        now,
      ),
    );
  }

  private async onCardOn(reader: MarginalisedReader) {
    const now = this.dateTimeService.now();

    await this.subscriptionRegistry.publish(
      ["reader*"],
      ReaderSubscriptionEvent.KeyOn(reader.id, now),
    );
    await this.read(reader);
  }

  private async onCardOff(reader: MarginalisedReader) {
    const now = this.dateTimeService.now();
    await this.subscriptionRegistry.publish(
      ["reader*"],
      ReaderSubscriptionEvent.KeyOff(reader.id, now),
    );
  }

  private async read(reader: MarginalisedReader) {
    const now = this.dateTimeService.now();

    try {
      const keyId = await reader.loadKeyId(this.path);

      if (!keyId) {
        await this.subscriptionRegistry.publish(
          ["reader*"],
          ReaderSubscriptionEvent.NoTagRead(reader.id, now),
        );

        return;
      }

      this.logger.info(
        `Reader ${reader.id.serialize()} Key read (${keyId.serialize()})`,
      );
      await this.subscriptionRegistry.publish(
        ["reader*"],
        ReaderSubscriptionEvent.KeyIdRead(reader.id, keyId.serialize(), now),
      );
    } catch (e) {
      this.logger.error(`Reader '${reader.id}'`, e);
      await this.subscriptionRegistry.publish(
        ["reader*"],
        ReaderSubscriptionEvent.ReadFailed(
          reader.id,
          e instanceof Error ? e.message : "Unknown error",
          now,
        ),
      );
    }
  }

  async write(readerId: ReaderId, keyId: KeyId) {
    const reader = this.readers.get(readerId.serialize());

    if (!reader) {
      throw InfrastructureError.because(
        `Reader "${readerId.serialize()}" not found`,
      );
    }

    await reader.writeKeyId(this.uriPrefix, this.path, keyId);
  }

  getReaders() {
    return [...this.readers.entries()].map(
      ([id, reader]) =>
        ({
          id,
          name: reader.name,
        }) as const,
    );
  }

  async unregister(reader: MarginalisedReader) {
    const now = this.dateTimeService.now();
    reader.removeAllListeners();
    this.readers.delete(reader.id.serialize());
    this.logger.warn(`Unregistered reader "${reader.name}"`);
    await this.subscriptionRegistry.publish(
      ["reader*"],
      ReaderSubscriptionEvent.Disconnected(reader.id, now),
    );
  }
}
