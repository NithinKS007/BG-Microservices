import * as grpc from "@grpc/grpc-js";

export type ServerUnaryCall<Req, Res> = grpc.ServerUnaryCall<Req, Res>;
export type SendUnaryData<Res> = grpc.sendUnaryData<Res>;

import * as protoLoader from "@grpc/proto-loader";

const packageDefinition = protoLoader.loadSync('user.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;
// Now you can use userProto.UserService