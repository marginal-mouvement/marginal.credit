import { Contract } from "@marginal.credit/sdk";
import { z } from "zod";

import { SimpleShowSchema } from "./show.schemas";

export const ShowApi = {
  Create: Contract.forReturningCommand({
    path: "/show/create",
    bodySchema: z.object({
      name: z.string(),
      thumbnailUrl: z.string().optional(),
      date: z.coerce.date(),
      reward: z.number().positive(),
    }),
    outputSchema: SimpleShowSchema,
    withAuth: true,
  }),

  AllShows: Contract.forSimpleQuery({
    path: "/show/all",
    outputSchema: z.object({ shows: z.array(SimpleShowSchema) }),
    withAuth: true,
  }),
} as const;
