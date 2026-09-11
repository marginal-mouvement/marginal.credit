import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { KeyId } from "@marginal.credit/backend-framework";

import type { RequestContext } from "../application/requestContext";

export class HonoRequestContext implements RequestContext {
  constructor(private readonly context: Context) {}

  getToken() {
    const inHeaders = this.context.req.header("X-API-KEY");

    if (inHeaders) {
      return inHeaders;
    }

    const inCookies = getCookie(this.context, "session");

    if (inCookies) {
      return inCookies;
    }
  }

  setToken(token: string) {
    setCookie(this.context, "session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 34560000,
      path: "/",
    });
  }

  getKeyId() {
    const keyId = this.context.req.header("X-KEY-ID");

    if (keyId) {
      return KeyId.parse(keyId);
    }
  }
}
