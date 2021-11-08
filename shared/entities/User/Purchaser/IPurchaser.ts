import { IUser, UserRole } from '../IUser';

export interface IPurchaser extends IUser {
  role: UserRole.Purchaser;
}
