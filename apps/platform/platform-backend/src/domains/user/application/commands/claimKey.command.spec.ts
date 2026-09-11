// import {
//   InMemoryDatabase,
//   InMemoryTransactionPerformer,
// } from "@ddd-ts/store-inmemory";
// import { ApplicationError, KeyId } from "@marginal.credit/backend-framework";
//
// import { ClaimKeyCommand, ClaimKeyCommandHandler } from "./claimKey.command";
//
// import { InMemoryUserStore } from "../../infra/inMemory.user.store";
// import { InMemoryKeyStore } from "../../../key/infra/inMemory.key.store";
// import { Email } from "../../domain/email";
// import { Key } from "../../../key/domain/key";
// import { User } from "../../domain/user";
//
//
// describe("ClaimKeyCommand", () => {
//   function createHandler() {
//     const db = new InMemoryDatabase();
//     const userStore = new InMemoryUserStore(db);
//     const keyStore = new InMemoryKeyStore(db);
//     const handler = new ClaimKeyCommandHandler(
//       userStore,
//       keyStore,
//       new InMemoryTransactionPerformer(db),
//     );
//
//     return { userStore, keyStore, handler };
//   }
//
//   it("should claim a key successfully", async () => {
//     const { keyStore, userStore, handler } = createHandler();
//     const key = Key.create();
//     await keyStore.save(key);
//
//     const command = new ClaimKeyCommand({
//       email: new Email("test@example.com"),
//       name: "john",
//       keyId: key.id,
//       refererName: undefined,
//     });
//
//     await handler.execute(command);
//
//     const user = await userStore.loadByName("john");
//     expect(user).toBeDefined();
//     expect(user?.email.serialize()).toBe("test@example.com");
//
//     const updatedKey = await keyStore.load(key.id);
//     expect(updatedKey?.ownerId?.serialize()).toBe(user?.id.serialize());
//   });
//
//   it("should claim a key with a referrer", async () => {
//     const { keyStore, userStore, handler } = createHandler();
//     const referrer = User.create({
//       "referrer",
//       new Email("ref@example.com"),
//       undefined,
//     });
//     await userStore.save(referrer);
//
//     const key = Key.create();
//     await keyStore.save(key);
//
//     const command = new ClaimKeyCommand({
//       email: new Email("test@example.com"),
//       name: "john",
//       keyId: key.id,
//       refererName: "referrer",
//     });
//
//     await handler.execute(command);
//
//     const user = await userStore.loadByName("john");
//     expect(user).toBeDefined();
//   });
//
//   it("should throw if referrer is not found", async () => {
//     const { keyStore, handler } = createHandler();
//     const key = Key.create();
//     await keyStore.save(key);
//
//     const command = new ClaimKeyCommand({
//       email: new Email("test@example.com"),
//       name: "john",
//       keyId: key.id,
//       refererName: "nonexistent",
//     });
//
//     await expect(handler.execute(command)).rejects.toThrow(
//       ApplicationError.notFound(User, "nonexistent"),
//     );
//   });
//
//   it("should throw if name is already taken", async () => {
//     const { keyStore, userStore, handler } = createHandler();
//     const existingUser = User.create(
//       "taken",
//       new Email("existing@example.com"),
//       undefined,
//     );
//     await userStore.save(existingUser);
//
//     const key = Key.create();
//     await keyStore.save(key);
//
//     const command = new ClaimKeyCommand({
//       email: new Email("test@example.com"),
//       name: "taken",
//       keyId: key.id,
//       refererName: undefined,
//     });
//
//     await expect(handler.execute(command)).rejects.toThrow(
//       ApplicationError.conflict('Name "taken" taken'),
//     );
//   });
//
//   it("should throw if key is not found", async () => {
//     const keyId = KeyId.generate();
//
//     const { handler } = createHandler();
//     const command = new ClaimKeyCommand({
//       email: new Email("test@example.com"),
//       name: "john",
//       keyId,
//       refererName: undefined,
//     });
//
//     await expect(handler.execute(command)).rejects.toThrow(
//       ApplicationError.notFound(Key, keyId),
//     );
//   });
// });
