import { EsAggregate, EsEvent, On } from "@ddd-ts/core";
import { DomainError, UserId } from "@marginal.credit/backend-framework";
import { Multiple, Optional } from "@ddd-ts/shape";

import { Email } from "./email";

import { ShowId } from "../../show/domain/showId";

export class UserCreated extends EsEvent("UserCreated", {
  id: UserId,
  name: String,
  email: Email,
  referrerId: Optional(UserId),
  referrerName: Optional(String),
  duringShow: Optional(ShowId),
  at: Date,
}) {}

export class UserBalanceDebited extends EsEvent("UserDebited", {
  id: UserId,
  amount: Number,
  transfer: {
    label: String,
    thumbnailUrl: Optional(String),
    date: Date,
  },
}) {}

export class UserBalanceCredited extends EsEvent("UserCredited", {
  id: UserId,
  amount: Number,
  transfer: {
    label: String,
    thumbnailUrl: Optional(String),
    date: Date,
  },
}) {}

export class User extends EsAggregate("User", {
  events: [UserCreated, UserBalanceDebited, UserBalanceCredited],
  state: {
    id: UserId,
    name: String,
    email: Email,
    balance: Number,
    visitedShows: Multiple(ShowId),
    emailConfirmed: Boolean,
    createdAt: Optional(Date),
  },
}) {
  static create({
    name,
    email,
    referrerId,
    duringShow,
    referrerName,
    at,
  }: {
    name: string;
    email: Email;
    referrerId?: UserId;
    referrerName?: string;
    duringShow?: ShowId;
    at: Date;
  }) {
    return this.new(
      UserCreated.new({
        id: UserId.generate(),
        name,
        email,
        referrerId,
        referrerName,
        duringShow,
        at,
      }),
    );
  }

  @On(UserCreated)
  private static onUserCreated(event: UserCreated) {
    const duringShow = event.payload.duringShow;
    return new User({
      id: event.payload.id,
      name: event.payload.name,
      email: event.payload.email,
      visitedShows: duringShow ? [duringShow] : [],
      emailConfirmed: false,
      balance: 0,
      createdAt: event.payload.at,
    });
  }

  debit(
    amount: number,
    at: Date,
    transfer: {
      label: string;
      thumbnailUrl?: string;
    },
  ) {
    if (amount <= 0) {
      throw DomainError.malformed("amount", "must be positive");
    }

    if (this.balance - amount < 0) {
      throw DomainError.forbidden("insufficient balance");
    }

    this.apply(
      UserBalanceDebited.new({
        id: this.id,
        amount,
        transfer: {
          label: transfer.label,
          thumbnailUrl: transfer.thumbnailUrl,
          date: at,
        },
      }),
    );
  }

  @On(UserBalanceDebited)
  protected onUserDebited(event: UserBalanceDebited) {
    this.balance -= event.payload.amount;
  }

  credit(
    amount: number,
    at: Date,
    transfer: {
      label: string;
      thumbnailUrl?: string;
    },
  ) {
    if (amount <= 0) {
      throw DomainError.malformed("amount", "must be positive");
    }

    this.apply(
      UserBalanceCredited.new({
        id: this.id,
        amount,
        transfer: {
          label: transfer.label,
          thumbnailUrl: transfer.thumbnailUrl,
          date: at,
        },
      }),
    );
  }

  @On(UserBalanceCredited)
  protected onUserCredited(event: UserBalanceCredited) {
    this.balance += event.payload.amount;
  }
}
