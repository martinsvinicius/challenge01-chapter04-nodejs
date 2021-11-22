import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement Use Case tests", () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should create a statement of deposit type", async () => {
    const user = await usersRepository.create({
      name: "John Mayer",
      email: "example@test.com",
      password: "secretPassword123",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit test",
    });

    expect(statement.id).toEqual(expect.any(String));
  });

  it("should create a statement of withdraw type", async () => {
    const user = await usersRepository.create({
      name: "John Snow",
      email: "example@test.com",
      password: "secretPassword123",
    });

    // deposit
    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Withdraw test",
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "Withdraw test",
    });

    expect(withdraw.id).toEqual(expect.any(String));
  });

  it("should not create a statement of withdraw type when user has insufficient funds", async () => {
    const user = await usersRepository.create({
      name: "John Snow",
      email: "example@test.com",
      password: "secretPassword123",
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "Withdraw test",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should not create a statement when user does not exist", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "invalid-user-id",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Deposit test",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
