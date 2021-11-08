import { IdentifiableUser } from 'entities/User';

export type ResGetAll = Omit<IdentifiableUser, 'password'>[];
