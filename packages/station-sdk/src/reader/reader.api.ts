import { Contract } from "@marginal.credit/sdk";
import { z } from "zod";

export const ReaderApi = {
  WriteKeyId: Contract.forSilentCommand({
    path: "/reader/write",
    withAuth: false,
    bodySchema: z.object({
      keyId: z.string(),
      readerId: z.string(),
    }),
  }),

  GetAll: Contract.forSimpleQuery({
    path: "/reader/list",
    withAuth: false,
    outputSchema: z.object({
      readers: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        }),
      ),
    }),
  }),
};
