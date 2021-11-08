import { IMongooseIdentifiable } from 'entities/Base';
import { IUser, IdentifiableUser } from 'entities/User';

export type ReqUpdate = Partial<IUser> & IMongooseIdentifiable;

export type ResUpdate = Omit<IdentifiableUser, 'password'>;
