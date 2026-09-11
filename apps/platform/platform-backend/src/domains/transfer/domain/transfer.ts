import { Choice, Optional, Shape } from "@ddd-ts/shape";
import { UserId } from "@marginal.credit/backend-framework";

import { TransferId } from "./transferId";

export class Transfer extends Shape({
  id: TransferId,
  userId: UserId,
  label: String,
  thumbnailUrl: Optional(String),
  amount: Number,
  kind: Choice(["credit", "debit"]),
  date: Date,
}) {
  static create({
    userId,
    label,
    amount,
    kind,
    date,
    thumbnailUrl,
  }: {
    userId: UserId;
    label: string;
    thumbnailUrl?: string;
    amount: number;
    kind: "credit" | "debit";
    date: Date;
  }) {
    return new Transfer({
      id: TransferId.generate(),
      userId,
      label,
      amount,
      kind,
      date,
      thumbnailUrl,
    });
  }
}
