import { IUser, UserRole } from '../IUser';

export interface IExpert extends IUser {
  role: UserRole.Expert;
}
