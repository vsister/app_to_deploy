import { IUser, UserRole } from '../IUser';

export interface IAdmin extends IUser {
  role: UserRole.Admin;
}
