import { IMongooseIdentifiable } from '../Base/IIdentifiable';

export enum UserRole {
  Admin = 'admin',
  Purchaser = 'purchaser',
  Expert = 'expert',
  Editor = 'editor',
}

export interface IUser {
  username: string;
  name: string;
  role: UserRole;
  password?: string;
}

export interface IdentifiableUser extends IUser, IMongooseIdentifiable {}
