import { IdentifiableUser } from 'entities/User';

export interface ReqGetOneByUsername {
  username: any;
}

export type ResGetOneByUsername = Omit<IdentifiableUser, 'password'>;
