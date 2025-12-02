import { IMessageService, IUserService } from "../interface/interface";
import { IUserRepository } from "../interface/IUser.repository";

export class UserService implements IUserService {
  constructor(
    private readonly messageService: IMessageService,
    private readonly userRepository: IUserRepository
  ) {}

  async createUser(): Promise<void> {
    await this.messageService.consumeMessages({
      topic: "user-reg-event-req",
      handler: this.handleRegEventRes.bind(this),
    });
  }
  private async handleRegEventRes(message: {
    key: string;
    value: {
      email: string;
      password: string;
      name: string;
    };
  }): Promise<void> {
    const findExistingEmail = await this.userRepository.findOne({
      email: message.value.email,
    });

    if (findExistingEmail) {
      await this.messageService.publishMessage({
        topic: "user-reg-event-res",
        message: {
          key: message.key,
          value: JSON.stringify({
            status: "failed",
            data: findExistingEmail,
            error: "Email already exists",
            correlationId: message.key,
          }),
        },
      });
      return;
    }

    const userData = await this.userRepository.create({
      email: message.value.email,
      password: message.value.password,
      name: message.value.name,
    });

    await this.messageService.publishMessage({
      topic: "user-reg-event-res",
      message: {
        key: message.key,
        value: JSON.stringify({
          status: "success",
          data: userData,
          correlationId: message.key,
        }),
      },
    });
  }
}
