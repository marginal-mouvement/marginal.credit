import { Contract } from "@marginal.credit/sdk";
import { z } from "zod";

export const SubscriptionApi = {
  Create: Contract.forReturningCommand({
    path: "/subscription/create",
    withAuth: false,
    bodySchema: z.object({}),
    outputSchema: z.object({
      subscriptionId: z.string(),
    }),
  }),
} as const;
