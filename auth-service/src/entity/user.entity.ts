export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: Date|undefined
  updatedAt?:Date|undefined
}
