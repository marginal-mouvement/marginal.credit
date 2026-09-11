import type {
  DatetimeService,
  KeyId,
} from "@marginal.credit/backend-framework";
import { ApplicationError, UserId } from "@marginal.credit/backend-framework";

import type { RequestContext } from "./requestContext";
import type { SessionStore } from "./session.store";
import type { TokenParser } from "./tokenParser";

import { Actor } from "../domain/actor";
import type { KeyStore } from "../../key/application/key.store";
import { Permission } from "../domain/permission";

export class Authenticator {
  constructor(
    private readonly keyStore: KeyStore,
    private readonly sessionStore: SessionStore,
    private readonly tokenParser: TokenParser,
    private readonly datetimeService: DatetimeService,
  ) {}

  async authenticate(requestContext: RequestContext) {
    const token = requestContext.getToken();
    const now = this.datetimeService.now();

    if (token) {
      return this.authenticateViaToken(token, now);
    }

    const keyId = requestContext.getKeyId();

    if (!keyId) {
      throw ApplicationError.unauthorized("No token or key provided");
    }

    return this.authenticateViaKey(keyId);
  }

  async authenticateViaToken(token: string, now: Date) {
    const sessionId = await this.tokenParser.parse(token);
    const session = await this.sessionStore.load(sessionId);

    if (!session) {
      throw ApplicationError.unauthorized("Session not found");
    }

    session.ensureIsUsable(now);

    return new Actor(
      session.userId ?? UserId.station(),
      session.permission,
      "session",
    );
  }

  async authenticateViaKey(keyId: KeyId) {
    const key = await this.keyStore.load(keyId);

    if (!key) {
      throw ApplicationError.unauthorized("Key not found");
    }

    if (!key.ownerId) {
      throw ApplicationError.unauthorized("Key is not assigned to a user");
    }

    return new Actor(key.ownerId, Permission.basic(), "keyId");
  }
}
