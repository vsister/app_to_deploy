import { IOrder } from 'entities/Order';

export interface ReqUpdateOrder {
  id: string;
  order: Partial<Omit<IOrder, 'products' | 'author' | 'id' | 'createdAt'>>;
}

export type ResUpdateOrder = IOrder;
