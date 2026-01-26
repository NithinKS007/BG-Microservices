export class AuthService {
  constructor() {}

  signup(data: { name: string; email: string; password: string }): Promise<void> {
    return Promise.resolve();
  }

  signin(data: { email: string; password: string }): Promise<void> {
    return Promise.resolve();
  }
}
