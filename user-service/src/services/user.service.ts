import { IUserService } from "../interface/interface";
import { IUserRepository } from "../interface/IUser.repository";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  create(): Promise<void> {
    return Promise.resolve();
  }
}
