import type { User } from "../domain/user";

export class HttpUserSerializer {
  serializeUser(user: User) {
    return {
      id: user.id.serialize(),
      name: user.name,
      email: user.email.serialize(),
      balance: user.balance,
      visitedShows: user.visitedShows.map((show) => show.serialize()),
      emailConfirmed: user.emailConfirmed,
      createdAt: user.createdAt,
    };
  }
}
