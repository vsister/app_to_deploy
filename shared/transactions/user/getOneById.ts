import { IdentifiableUser } from 'entities/User';

export interface ReqGetOneById {
  _id: any;
}

export type ResGetOneById = Omit<IdentifiableUser, 'password'>;
