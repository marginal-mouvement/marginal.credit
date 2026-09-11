import type { Reader } from "@tockawa/nfc-pcsc";
import { KeyId } from "@marginal.credit/backend-framework";

import { Buffer } from "node:buffer";

import { NdefUri } from "./utils/ndefUri";
import { Type2Tlv } from "./utils/type2Tlv";
import { Type2TagIo } from "./utils/type2TagIo";
import type { UriPrefix } from "./utils/uriPrefix";

import { ReaderId } from "../domain/readerId";

export class MarginalisedReader {
  private static readonly START_PAGE = 4;
  private static readonly READ_PAGES = 16;

  private readonly io: Type2TagIo;

  constructor(
    private readonly reader: Reader,
    readonly id: ReaderId,
  ) {
    this.io = new Type2TagIo(reader);
  }

  removeAllListeners() {
    this.reader.removeAllListeners();
  }

  get name() {
    return this.reader.name;
  }

  get stringId() {
    return this.id.serialize();
  }

  async writeKeyId(uriPrefix: UriPrefix, path: string, key: KeyId) {
    const url = `${path}/${key.serialize()}`;
    const ndef = NdefUri.encodeRecord(uriPrefix, url);
    const tlv = Type2Tlv.wrap(ndef);
    const data = Type2TagIo.padTo4(tlv);

    await this.io.invalidateAt(MarginalisedReader.START_PAGE);
    await this.io.writePages(MarginalisedReader.START_PAGE, data);

    const extraPage = MarginalisedReader.START_PAGE + data.length / 4;
    await this.io.writePages(extraPage, Buffer.alloc(4, 0x00));
  }

  async loadKeyId(path: string) {
    const raw = await this.io.readPages(
      MarginalisedReader.START_PAGE,
      MarginalisedReader.READ_PAGES,
    );

    const ndef = Type2Tlv.extract(raw);

    if (!ndef) {
      return undefined;
    }

    const url = NdefUri.decodeFirstRecordToUrl(ndef);

    if (!url) {
      return undefined;
    }

    const expectedPrefix = `${path}/`;

    if (!url.startsWith(expectedPrefix)) {
      return undefined;
    }

    try {
      return KeyId.parse(url.slice(expectedPrefix.length));
    } catch {
      return undefined;
    }
  }

  static spawn(reader: Reader) {
    return new MarginalisedReader(reader, ReaderId.generate());
  }
}
