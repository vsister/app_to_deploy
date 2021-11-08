import { IUser, IdentifiableUser } from 'entities/User';

export type ReqCreate = IUser;

export type ResCreate = Omit<IdentifiableUser, 'password'>;
