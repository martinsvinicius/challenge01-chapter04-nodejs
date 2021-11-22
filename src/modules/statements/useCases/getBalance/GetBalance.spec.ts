import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementsRepository: IStatementsRepository;
let usersRepository: IUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance Use Case tests", () => {
  beforeAll(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("should get the balance of a user", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "example@test.com",
      password: "secret",
    });

    const { balance } = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance).toBe(0);
  });

  it("should not be able to get the balance when user does not exists", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "invalid-id" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
