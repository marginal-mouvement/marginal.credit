import type { Context, Hono } from "hono";
import type {
  AnyContract,
  AnyContractWithAuth,
  AnyContractWithoutAuth,
  PayloadOf,
  ResultOf,
  Topics,
} from "@marginal.credit/sdk";
import { streamSSE } from "hono/streaming";

import type { IActor, Router } from "../../core/router/router";
import { zodParse } from "../zod";
import type { SubscriptionRegistry } from "../../core";
import { Logger, Response, SubscriptionId } from "../../core";

export class HonoRouter<ActorImpl extends IActor> implements Router<ActorImpl> {
  constructor(
    private readonly hono: Hono,
    private readonly authenticateFunction: (ctx: Context) => Promise<ActorImpl>,
  ) {}

  private logger = Logger.for("HonoRouter");

  private async parsePayload<Contract extends AnyContract>(
    contract: Contract,
    ctx: Context,
  ): Promise<PayloadOf<Contract>> {
    let payload: PayloadOf<Contract> | undefined;

    if (contract.bodyType === "application/json") {
      const parsed = await ctx.req.json();
      payload = zodParse(contract.bodySchema, parsed);
    }

    return payload as PayloadOf<Contract>;
  }

  routeWithoutAuth<Contract extends AnyContractWithoutAuth>(
    contract: Contract,
    handle: (payload: PayloadOf<Contract>) => Promise<ResultOf<Contract>>,
  ) {
    this.hono[contract.method.toLowerCase() as "get" | "post"](
      contract.path,
      async (ctx) => {
        const result = await handle(await this.parsePayload(contract, ctx));
        const response = Response.ok(result);
        ctx.status(response.getStatus() as any);
        return ctx.json(response.serialize());
      },
    );

    this.logger.info(`Registered route ${contract.method} ${contract.path}`);
  }

  routeWithAuth<Contract extends AnyContractWithAuth>(
    contract: Contract,
    handle: (
      payload: PayloadOf<Contract>,
      actor: ActorImpl,
    ) => Promise<ResultOf<Contract>>,
  ) {
    this.hono[contract.method.toLowerCase() as "get" | "post"](
      contract.path,
      async (ctx) => {
        const actor = await this.authenticateFunction(ctx);
        const result = await handle(
          await this.parsePayload(contract, ctx),
          actor,
        );
        const response = Response.ok(result);
        ctx.status(response.getStatus() as any);
        return ctx.json(response.serialize());
      },
    );

    this.logger.info(`Registered route ${contract.method} ${contract.path}`);
  }

  subscription<T extends Topics<any, any>>(
    registry: SubscriptionRegistry<T>,
    defaultTopics?: Array<keyof T>,
  ) {
    this.hono.get("/events/:subscriptionId", async (context) => {
      const actor = await this.authenticateFunction(context);
      const subscriptionId = SubscriptionId.deserialize(
        context.req.param("subscriptionId"),
      );

      subscriptionId.ensureIsForUser(actor.id);

      return streamSSE(context, async (stream) => {
        const onHandled = async (event: any) =>
          await stream.writeSSE({
            data: JSON.stringify(event),
          });

        await stream.writeSSE({
          data: JSON.stringify({
            name: "Handshake",
            at: new Date(),
            payload: undefined,
          }),
        });

        const token = registry.registerHandler(subscriptionId, onHandled);

        if (defaultTopics) {
          for (const topic of defaultTopics) {
            registry.subscribe(topic, subscriptionId);
          }
        }

        return new Promise((resolve) => {
          stream.onAbort(() => {
            registry.detachConnectionIfCurrent(subscriptionId, token);
            resolve();
          });
        });
      });
    });
  }
}
