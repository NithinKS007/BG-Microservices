import * as grpc from "@grpc/grpc-js";

export function startGrpcServer(
  serviceDefinition: grpc.ServiceDefinition<any>,
  implementation: grpc.UntypedServiceImplementation,
  port: string = "50051",
) {
  const server = new grpc.Server();

  server.addService(serviceDefinition, implementation);

  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
    if (err) {
      console.error(`Failed to bind: ${err.message}`);
      return;
    }
    console.log(`🚀 gRPC Service live on port ${boundPort}`);
  });

  process.on("SIGINT", () => {
    console.log("Shutting down gRPC server...");
    server.tryShutdown(() => process.exit(0));
  });
}
