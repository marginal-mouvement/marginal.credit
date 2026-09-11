import { Contract } from "@marginal.credit/sdk";
import { z } from "zod";

export const KeyApi = {
  Create: Contract.forReturningCommand({
    path: "/key/create",
    bodySchema: z.object({
      showId: z.string().optional(),
    }),
    outputSchema: z.object({
      keyId: z.string(),
    }),
    withAuth: true,
  }),

  IsAvailable: Contract.forQuery({
    path: "/key/available",
    bodySchema: z.object({
      keyId: z.string(),
    }),
    outputSchema: z.object({
      available: z.boolean(),
    }),
    withAuth: false,
  }),
} as const;
