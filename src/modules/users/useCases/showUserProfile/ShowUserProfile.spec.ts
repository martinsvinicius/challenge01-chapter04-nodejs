import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile Use Case tests", () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should show a user profile", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "example@test.com",
      password: "123456",
    });

    const userProfile = await showUserProfileUseCase.execute(user.id);

    expect(userProfile.id).toEqual(user.id);
  });

  it("should not show a user profile with an invalid user id", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("invalid-user-id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
