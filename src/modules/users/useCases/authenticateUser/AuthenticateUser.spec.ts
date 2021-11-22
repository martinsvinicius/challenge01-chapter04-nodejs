import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { hashSync } from "bcryptjs";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User Use Case tests", () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("should authenticate a user", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "email@test.com",
      password: hashSync("123456", 8),
    });

    const response = await authenticateUserUseCase.execute({
      email: "email@test.com",
      password: "123456",
    });

    expect(response.token).toBeDefined();
  });

  it("should not authenticate a user with incorrect email", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "email@test.com",
      password: hashSync("123456", 8),
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "invalid@email.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not authenticate a user with incorrect password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "email@test.com",
      password: hashSync("123456", 8),
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "email@test.com",
        password: "invalid-password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
