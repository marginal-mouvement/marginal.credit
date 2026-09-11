import type { AlgorithmTypes } from "hono/jwt";
import { sign, verify } from "hono/jwt";
import { ApplicationError } from "@marginal.credit/backend-framework";

import type { TokenParser } from "../application/tokenParser";
import { SessionId } from "../domain/sessionId";

export class HonoTokenParser implements TokenParser {
  constructor(
    private readonly alg: AlgorithmTypes,
    private readonly key: string,
  ) {}

  async parse(token: string) {
    try {
      const payload = await verify(token, this.key, this.alg);
      return SessionId.parse(payload.sessionId);
    } catch (e) {
      throw ApplicationError.unauthorized("Invalid or expired token", e);
    }
  }

  async sign(sessionId: SessionId) {
    return await sign({ sessionId: sessionId.serialize() }, this.key, this.alg);
  }
}
