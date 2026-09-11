import type { z } from "zod";

import type {
  AnyContract,
  AnyContractWithoutPayload,
  AnyContractWithOutput,
  PayloadOf,
  ResultOf,
} from "./contract";
import type { Snapshots } from "./snapshot";
import { HandshakeSnapshot } from "./snapshot";

interface ServerError {
  ok: false;
  message: string;
  data: unknown;
}

interface OkResponse<T> {
  ok: true;
  data: T;
}

export class ApiClientError extends Error {
  constructor(readonly payload: unknown) {
    super(payload instanceof Error ? payload.message : "Unknown error");
  }
}

export class ApiServerError extends Error {
  constructor(readonly payload: ServerError) {
    super(payload.message);
  }
}

type ErrorCallback = (error: ApiClientError | ApiServerError) => void;

export abstract class SDK {
  constructor(private readonly baseUrl: string) {}

  abstract prepareHeaders(): HeadersInit;

  private defaultErrorCallback?: ErrorCallback;

  private handleError(
    error: ApiClientError | ApiServerError,
    errorCallback?: (error: ApiClientError | ApiServerError) => void,
  ) {
    if (errorCallback) {
      errorCallback(error);
      return;
    }

    this.defaultErrorCallback?.(error);
  }

  async use<T extends AnyContractWithoutPayload>(
    contract: T,
    payload?: PayloadOf<T>,
    onError?: ErrorCallback,
  ): Promise<ResultOf<T>>;
  async use<T extends AnyContract>(
    contract: T,
    payload: PayloadOf<T>,
    onError?: ErrorCallback,
  ): Promise<ResultOf<T>>;
  async use<T extends AnyContract>(
    contract: T,
    payload: PayloadOf<T> | undefined,
    onError?: ErrorCallback,
  ): Promise<ResultOf<T>> {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...this.prepareHeaders(),
    };

    const body =
      contract.method === "POST" ? JSON.stringify(payload ?? {}) : undefined;

    const response: OkResponse<ResultOf<T>> | ServerError = await fetch(
      `${this.baseUrl}${contract.path}`,
      {
        method: contract.method,
        headers,
        body,
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        const error = new ApiClientError(err);
        this.handleError(error, onError);
        throw error;
      });

    if (!response.ok) {
      const error = new ApiServerError(response);
      this.handleError(error, onError);
      throw error;
    }

    if (contract.outputSchema) {
      return contract.outputSchema.parse(response.data) as ResultOf<T>;
    }

    return undefined as ResultOf<T>;
  }

  withDefaultErrorCallback(callback: ErrorCallback) {
    this.defaultErrorCallback = callback;
    return this;
  }

  protected async useSubscription<T extends ReturnType<typeof Snapshots>>(
    subscribeContract: AnyContractWithOutput<{ subscriptionId: string }>,
    snapshots: T,
    callback: (event: z.infer<T>) => void,
  ) {
    const { subscriptionId } = (await this.use(
      subscribeContract,
      undefined,
    )) as { subscriptionId: string };

    const eventSource = new EventSource(
      `${this.baseUrl}/events/${subscriptionId}`,
      { withCredentials: true },
    );

    eventSource.onmessage = (e) => {
      const event: unknown = JSON.parse(e.data);

      if (
        typeof event === "object" &&
        event !== null &&
        "name" in event &&
        event.name === HandshakeSnapshot.shape.name.value
      ) {
        console.log(event);
        return;
      }

      callback(snapshots.parse(event));
    };

    const unsubscribe = () => {
      eventSource.close();
    };

    return { unsubscribe, subscriptionId };
  }
}
