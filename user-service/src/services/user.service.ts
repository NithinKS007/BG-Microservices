import { IUserRepository, UserModel } from "../interface/IUser.repository";

export class UserService {
  private readonly userRepository: IUserRepository;
  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }

  async findUserById(id: string): Promise<UserModel | null> {
    return await this.userRepository.findUserById(id);
  }
}
