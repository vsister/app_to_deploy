// import { IApproved, IOrder, IPending, IRejected } from '../../Order/IOrder';
import { UserRole, IUser } from '../IUser';

export interface IEditor extends IUser {
  role: UserRole.Editor;
}
