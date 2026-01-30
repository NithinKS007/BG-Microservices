import * as grpc from "@grpc/grpc-js";

export function createGrpcClient<T extends grpc.Client>(
  ClientClass: new (address: string, creds: grpc.ChannelCredentials) => T,
  serviceAddress: string,
): T {
  return new ClientClass(serviceAddress, grpc.credentials.createInsecure());
}
