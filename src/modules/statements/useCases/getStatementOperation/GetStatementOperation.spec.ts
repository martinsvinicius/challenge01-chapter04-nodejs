import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation Use Case tests", () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should get the statement operation of a user", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "example@test.com",
      password: "secret",
    });

    const statement = await statementsRepository.create({
      user_id: user.id,
      amount: 100,
      type: OperationType.DEPOSIT,
      description: "Deposit",
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id,
    });

    expect(operation).toEqual(statement);
  });

  it("should not be able to get the statement operation with invalid user id", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "John Doe",
        email: "example@test.com",
        password: "secret",
      });

      const statement = await statementsRepository.create({
        user_id: user.id,
        amount: 100,
        type: OperationType.DEPOSIT,
        description: "Deposit",
      });

      await getStatementOperationUseCase.execute({
        user_id: "invalid-id",
        statement_id: statement.id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get the statement operation with invalid statement id", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "example@test.com",
      password: "secret",
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "invalid-id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
