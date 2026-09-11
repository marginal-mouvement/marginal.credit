import { Command, CommandHandler } from "@marginal.credit/backend-framework";

import type { Actor } from "../../../auth/domain/actor";
import type { ShowStore } from "../show.store";
import { Show } from "../../domain/show";

export class CreateShowCommand extends Command<Show> {
  constructor(
    readonly payload: {
      actor: Actor;
      name: string;
      reward: number;
      date: Date;
      thumbnailUrl?: string;
    },
  ) {
    super();
  }
}

export class CreateShowCommandHandler extends CommandHandler(
  CreateShowCommand,
) {
  constructor(private readonly showStore: ShowStore) {
    super();
  }

  async execute(command: CreateShowCommand) {
    const { actor, name, reward, date, thumbnailUrl } = command.payload;

    actor.ensureIsAtLeastStation();

    const show = Show.create({
      name,
      reward,
      date,
      thumbnailUrl,
    });

    await this.showStore.save(show);

    return show;
  }
}
