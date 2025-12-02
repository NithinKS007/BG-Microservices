import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
export interface IBaseController {
  handle(request: Request, response: Response): Promise<void>;
}

export interface IJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

export interface IJwtService {
  createAccessToken(payload: IJwtPayload): Promise<string>;
  createRefreshToken(payload: IJwtPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<IJwtPayload>;
  verifyRefreshToken(token: string): Promise<IJwtPayload>;
}

export interface IAuthService {
  signUp(data: { name: string; email: string; password: string }): Promise<void>;
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

export interface KafkaConfig {
  clientId: string;
  brokers: string[];
}

export interface PublishMessageParams<T> {
  topic: string;
  message: T;
}

export interface MessageHandler<T> {
  (payload: T): Promise<void> | void;
}

export interface ConsumerHandler {
  correlationId: string;
  status: string;
  data?: object; 
  error?: string;
}
