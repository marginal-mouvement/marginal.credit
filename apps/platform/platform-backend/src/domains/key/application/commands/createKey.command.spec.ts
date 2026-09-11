// import { InMemoryDatabase } from "@ddd-ts/store-inmemory";
// import { ApplicationError } from "@marginal.credit/backend-framework";
//
// import { CreateKeyCommand, CreateKeyCommandHandler } from "./createKey.command";
//
// import { InMemoryKeyStore } from "../../infra/inMemory.key.store";
// import { Actor } from "../../../auth/domain/actor";
// import { Permission } from "../../../auth/domain/permission";
//
//
// describe("CreateKeyCommand", () => {
//   function createHandler() {
//     const db = new InMemoryDatabase();
//     const keyStore = new InMemoryKeyStore(db);
//     const showStore = new (db);
//     const handler = new CreateKeyCommandHandler(keyStore);
//
//     return { keyStore, handler };
//   }
//
//   it("should create a key", async () => {
//     const { keyStore, handler } = createHandler();
//     const actor = Actor.generate(Permission.station());
//     const command = new CreateKeyCommand({ actor });
//
//     const result = await handler.execute(command);
//
//     const savedKey = await keyStore.load(result.id);
//     expect(savedKey).toBeDefined();
//     expect(savedKey?.id).toEqual(result.id);
//   });
//
//   it("should throw if actor has insufficient permissions", async () => {
//     const { handler } = createHandler();
//     const actor = Actor.generate(Permission.basic());
//     const command = new CreateKeyCommand({ actor });
//
//     await expect(handler.execute(command)).rejects.toThrow(
//       ApplicationError.forbidden("Station", "Basic").message,
//     );
//   });
// });
