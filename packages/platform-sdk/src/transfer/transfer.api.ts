import { Contract } from "@marginal.credit/sdk";
import { z } from "zod";

import { SimpleTransferSchema } from "./transfer.schemas";

export const TransferApi = {
  AllMines: Contract.forSimpleQuery({
    path: "/transfer/my",
    outputSchema: z.object({ transfers: z.array(SimpleTransferSchema) }),
    withAuth: true,
  }),
} as const;
