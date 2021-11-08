import { IQuantifiableProduct } from '../Product';
import { IdentifiableUser, IUser, UserRole } from '../User';

export enum OrderStatus {
  Rejected = 'rejected',
  Verified = 'verified',
  Pending = 'pending',
  Approved = 'approved',
}

export interface IOrder {
  id: string;
  name: string;
  author: Omit<IdentifiableUser, 'password'>;
  status: OrderStatus;
  verifiedBy?: (IUser & { role: UserRole.Expert }) | null;
  approvedBy?: (IUser & { role: UserRole.Editor }) | null;
  rejectedBy?: (IUser & { role: UserRole.Expert | UserRole.Editor }) | null;
  meta: {
    orderNumber: string;
    totalPrice: number;
    financingSource: string;
    deliveryAddress: string;
    deadline: string;
    feedbackContact: string;
    materiallyResponsible: string;
  };
  createdAt: Date;
  products: IQuantifiableProduct[];
}

export interface IPending {
  status: OrderStatus.Pending;
}

export interface IVerified {
  status: OrderStatus.Verified;
}

export interface IApproved {
  status: OrderStatus.Approved;
}

export interface IRejected {
  status: OrderStatus.Rejected;
}
