export interface KafkaConfig {
  clientId: string;
  brokers: string[];
}

export interface PublishMessageParams<T> {
  topic: string;
  message: T;
}

export interface MessageHandler<T> {
  (payload: T): Promise<void>;
}

export interface IMessageService {
  consumeMessages<T>(data: {
    topic: string;
    handler: MessageHandler<T>;
  }): Promise<void>;
  publishMessage<T>(params: PublishMessageParams<T>): Promise<void>;
  connectProducer(): Promise<void>;
  connectConsumer(): Promise<void>;
}

export interface IBaseController {
  handle(request: Request, response: Response): Promise<void>;
}

export interface IUserService {
  createUser(): Promise<void>;
}
