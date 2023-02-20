import UserModel, { User } from './user.model';

export function createUser(input: Partial<User>) {
  return UserModel.create(input);
}
