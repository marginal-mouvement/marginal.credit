import { Contract } from "@marginal.credit/sdk";
import { z } from "zod";

import {
  SimpleUserSchema,
  TransferIntentSchema,
  UsernameSchema,
} from "./user.schemas";

export const UserApi = {
  ClaimKey: Contract.forReturningCommand({
    path: "/user/claim",
    bodySchema: z.object({
      email: z.email(),
      name: UsernameSchema,
      keyId: z.string(),
      refererName: UsernameSchema.optional(),
    }),
    outputSchema: SimpleUserSchema,
    withAuth: false,
  }),

  Me: Contract.forSimpleQuery({
    path: "/user/me",
    outputSchema: SimpleUserSchema,
    withAuth: true,
  }),

  GetByKey: Contract.forReturningCommand({
    path: "/user/by-key",
    bodySchema: z.object({
      keyId: z.string(),
    }),
    outputSchema: SimpleUserSchema,
    withAuth: true,
  }),

  Credit: Contract.forSilentCommand({
    path: "/user/credit",
    bodySchema: TransferIntentSchema,
    withAuth: true,
  }),

  Debit: Contract.forSilentCommand({
    path: "/user/debit",
    bodySchema: TransferIntentSchema,
    withAuth: true,
  }),
} as const;
