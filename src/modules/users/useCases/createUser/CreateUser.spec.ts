import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User Use Case tests", () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "example@test.com",
      password: "123456",
    });

    expect(user.id).toBeDefined();
  });

  it("should not create a user with an existing email", async () => {
    const user: ICreateUserDTO = {
      name: "John Doe",
      email: "testing@email.com",
      password: "123456",
    };

    await createUserUseCase.execute(user);

    expect(async () => {
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
