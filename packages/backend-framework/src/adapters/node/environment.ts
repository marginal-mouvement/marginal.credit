import { findUpSync } from "find-up";
import { config } from "dotenv";

config({
  path: findUpSync(".env"),
});

export class Environment {
  static get(key: string) {
    const value = process.env[key];

    if (value === undefined) {
      throw new Error(`Environment variable '${key}' is missing`);
    }

    return value;
  }
}
