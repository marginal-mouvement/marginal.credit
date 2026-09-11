import { type PayloadOf, SDK } from "@marginal.credit/sdk";

import { KeyApi } from "./key";
import { UserApi } from "./user";
import { ShowApi } from "./show";
import { TransferApi } from "./transfer";

class KeyService {
  constructor(private readonly sdk: SDK) {}

  create(showId?: string) {
    return this.sdk.use(KeyApi.Create, {
      showId,
    });
  }

  async isAvailable(keyId: string) {
    return (
      await this.sdk.use(KeyApi.IsAvailable, {
        keyId,
      })
    ).available;
  }
}

class UserService {
  constructor(private readonly sdk: SDK) {}

  claimKey(payload: PayloadOf<typeof UserApi.ClaimKey>) {
    return this.sdk.use(UserApi.ClaimKey, payload);
  }

  me() {
    return this.sdk.use(UserApi.Me, undefined);
  }

  getByKey(keyId: string) {
    return this.sdk.use(UserApi.GetByKey, { keyId });
  }

  debit(payload: PayloadOf<typeof UserApi.Debit>) {
    return this.sdk.use(UserApi.Debit, payload);
  }

  credit(payload: PayloadOf<typeof UserApi.Credit>) {
    return this.sdk.use(UserApi.Credit, payload);
  }
}

class ShowService {
  constructor(private readonly sdk: SDK) {}

  create(payload: PayloadOf<typeof ShowApi.Create>) {
    return this.sdk.use(ShowApi.Create, payload);
  }

  all() {
    return this.sdk.use<typeof ShowApi.AllShows>(ShowApi.AllShows, undefined);
  }
}

class TransferService {
  constructor(private readonly sdk: SDK) {}

  allMines() {
    return this.sdk.use(TransferApi.AllMines, undefined);
  }
}

export class PlatformSDK extends SDK {
  readonly key = new KeyService(this);
  readonly user = new UserService(this);
  readonly show = new ShowService(this);
  readonly transfer = new TransferService(this);

  private apiKey: string | undefined;
  private keyId: string | undefined;

  constructor(baseUrl: string) {
    super(baseUrl);
  }

  loginByApiKey(apiKey: string | undefined) {
    this.apiKey = apiKey;
    return this;
  }

  loginByKey(keyId: string | undefined) {
    this.keyId = keyId;
    return this;
  }

  seemsAuthenticated() {
    return this.apiKey !== undefined || this.keyId !== undefined;
  }

  logout() {
    this.apiKey = undefined;
    this.keyId = undefined;
  }

  prepareHeaders(): HeadersInit {
    if (this.apiKey) {
      return {
        "X-API-KEY": this.apiKey,
      };
    }

    if (this.keyId) {
      return {
        "X-KEY-ID": this.keyId,
      };
    }

    return {};
  }
}
