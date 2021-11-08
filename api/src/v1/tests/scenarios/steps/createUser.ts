import { UserRole, IUser } from 'shared/entities/User';
import { UserService } from 'services/User/UserService';
import { AuthService } from 'services/Auth/AuthService';

export type Token = string;

export async function createUser(role: UserRole, name: string, username: string, password: string): Promise<Token> {
  const authService = new AuthService();
  const userService = new UserService();

  const testUser = {
    role,
    name,
    username,
    password,
  } as IUser;

  await userService.create(testUser);

  const token = await authService.authenticate({
    username,
    password,
  });

  return token;
}
