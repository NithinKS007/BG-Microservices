import { IAuthService } from "../interfaces/interfaces";

export class AuthService implements IAuthService {
  constructor() {}

  signUp(data: { name: string; email: string; password: string }): Promise<void> {
    return Promise.resolve();
  }
}
