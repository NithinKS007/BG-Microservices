import * as grpc from "@grpc/grpc-js";
import { logger } from "./../../src/logger";

export type GrpcHandler = grpc.UntypedServiceImplementation;
export type GrpcServiceDef = grpc.ServiceDefinition<grpc.UntypedServiceImplementation>;

export function startGrpcServer(
  serviceDefinition: GrpcServiceDef,
  implementation: GrpcHandler,
  port: string,
) {
  const server = new grpc.Server();

  server.addService(serviceDefinition, implementation);

  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
    if (err) throw err;
    logger.info(`🚀 gRPC running on ${boundPort}`);
  });

  process.on("SIGINT", () => {
    logger.info("Shutting down gRPC server...");
    server.tryShutdown(() => process.exit(0));
  });
}
