import {
  ConsumerHandler,
  IAuthService,
  IJwtService,
  IMessageService,
} from "../interfaces/interfaces";
import { codeGenerator } from "../../../utils/src";

export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: IJwtService,
    private readonly messageService: IMessageService
  ) {}

  async signUp(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<void> {
    const correlationId = codeGenerator().code;
    const { name, email, password } = data;
    if (!name || !email || !password) {
      throw new Error("Missing required fields.");
    }

    await this.messageService.publishMessage({
      topic: "user-reg-event-req",
      message: {
        key: `USER_REGISTERED${correlationId}`,
        value: JSON.stringify({
          status: "success",
          data: { name, email, password },
        }),
      },
    });

    await this.messageService.consumeMessages({
      topic: "user-reg-event-res",
      handler: this.handleRegEventRes.bind(this),
    });
  }

  private async handleRegEventRes(message: ConsumerHandler): Promise<void> {
    console.log("📩 Received registration response from ✅USER.SERVICE:", message);

    switch (message.status) {
      case "success":
        console.log(`✅ User registered with ID: ${message.data}`);

        break;

      case "failed":
        console.error("❌ User registration failed:", message.error);
        break;

      default:
        console.warn(`⚠️ Unknown status received: ${message.status}`, message);
        break;
    }
  }
}
