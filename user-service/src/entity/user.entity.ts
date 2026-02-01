export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role?: "admin" | "user" | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}
