import { comparePassword, hashPassword } from "../../../utils/src";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../utils/src/error.handling.middleware";
import { IUserRepository } from "../interface/IUser.repository";

export class UserService {
  private readonly userRepository: IUserRepository;
  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }

  async findUserById(id: string): Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
    createAt: Date;
    updateAt: Date;
  } | null> {
    return await this.userRepository.findUserById(id);
  }

  async signup(data: { name: string; email: string; password: string }): Promise<void> {
    const userData = await this.userRepository.findUserByEmail(data.email);
    if (userData) throw new ConflictError("Email already exists");
    await this.userRepository.createUser({ ...data, password: await hashPassword(data.password) });
  }

  async signin(data: { email: string; password: string }): Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    const userData = await this.userRepository.findUserByEmail(data.email);

    if (!userData) throw new NotFoundError("User not found,Please try again later");

    const isPasswordValid = await comparePassword(data.password, userData.password);
    if (!isPasswordValid) throw new ValidationError("Password is incorrect");

    const { password, ...safeUser } = userData;
    return safeUser;
  }
}
