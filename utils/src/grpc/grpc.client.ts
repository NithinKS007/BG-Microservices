import * as grpc from "@grpc/grpc-js";

export function createGrpcClient<T extends grpc.Client>(
  ClientClass: new (
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: grpc.ClientOptions,
  ) => T,
  address: string,
): T {
  return new ClientClass(address, grpc.credentials.createInsecure());
}
