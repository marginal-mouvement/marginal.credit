import { Logger } from "@marginal.credit/backend-framework";

export function execute(fn: () => Promise<void>) {
  const logger = new Logger(fn.name);
  fn()
    .catch((error) => {
      logger.error(error);
      process.exit(1);
    })
    .then(() => process.exit(0));
}
