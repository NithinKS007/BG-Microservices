import * as grpc from "@grpc/grpc-js";
import {
  ConflictError,
  DatabaseError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./../../src/error.handling.middleware";

/**
 * Convert domain error to gRPC ServiceError
 */
export const toGrpcError = (err: Error): grpc.ServiceError => {
  const grpcErr: grpc.ServiceError = {
    name: err.name,
    message: err.message,
    code: grpc.status.UNKNOWN,
    details: err.message,
    metadata: new grpc.Metadata(),
  };

  if (err instanceof ConflictError) grpcErr.code = grpc.status.ALREADY_EXISTS;
  if (err instanceof ValidationError) grpcErr.code = grpc.status.INVALID_ARGUMENT;
  if (err instanceof NotFoundError) grpcErr.code = grpc.status.NOT_FOUND;
  if (err instanceof ForbiddenError) grpcErr.code = grpc.status.PERMISSION_DENIED;
  if (err instanceof UnauthorizedError) grpcErr.code = grpc.status.UNAUTHENTICATED;
  if (err instanceof DatabaseError) grpcErr.code = grpc.status.INTERNAL;

  return grpcErr;
};

export const fromGrpcError = (err: grpc.ServiceError): Error => {
  switch (err.code) {
    case grpc.status.ALREADY_EXISTS:
      return new ConflictError(err.message);
    case grpc.status.INVALID_ARGUMENT:
      return new ValidationError(err.message);
    case grpc.status.NOT_FOUND:
      return new NotFoundError(err.message);
    case grpc.status.PERMISSION_DENIED:
      return new ForbiddenError(err.message);
    case grpc.status.UNAUTHENTICATED:
      return new UnauthorizedError(err.message);
    case grpc.status.INTERNAL:
    case grpc.status.UNKNOWN:
      return new DatabaseError(err.message);
    default:
      return new DatabaseError(err.message);
  }
};
