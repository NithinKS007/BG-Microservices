import {
  IMessageService,
  MessageHandler,
  PublishMessageParams,
} from "../interface/interface";
import { EachMessagePayload, ProducerRecord, Message } from "kafkajs";
import { GROUP_ID, kafkaConnect } from "../config/kafka.config";

export class KafkaService implements IMessageService {
  private producer;
  private consumer;
  constructor() {
    if (!GROUP_ID || typeof GROUP_ID !== "string") {
      throw new Error("Kafka group ID is required and must be a string.");
    }
    this.producer = kafkaConnect.producer();
    this.consumer = kafkaConnect.consumer({ groupId: GROUP_ID });
  }
  async connectProducer(): Promise<void> {
    await this.producer.connect();
    console.log(`[Kafka] Producer connected`);
  }
  async connectConsumer(): Promise<void> {
    await this.consumer.connect();
    console.log(`[Kafka] Consumer connected (groupId=${GROUP_ID})`);
  }

  async publishMessage<T>(params: PublishMessageParams<T>): Promise<void> {
    const { topic, message } = params;
    const payload: Message = {
      value: JSON.stringify(message),
    };
    const record: ProducerRecord = {
      topic,
      messages: [payload],
    };

    await this.producer.send(record);
    console.log(`[Kafka] Published to ${topic}: ${JSON.stringify(message)}`);
  }

  async consumeMessages<T>(data: {
    topic: string;
    handler: MessageHandler<T>;
  }): Promise<void> {
    const { topic, handler } = data;
    await this.consumer.subscribe({ topic, fromBeginning: false });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        try {
          if (!message?.value) {
            console.warn("Kafka message value is empty or null.");
            return;
          }
          const parsed: T = JSON.parse(message?.value.toString());
          await handler(parsed);
        } catch (err) {
          console.error(
            `[Kafka Consumer] Error processing message on topic "${topic}" [partition ${partition}]`,
            err
          );
        }
      },
    });
    console.log(`[Kafka] Subscribed to topic: ${topic}`);
  }
}
