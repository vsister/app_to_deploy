import { IOrder } from 'entities/Order';

export type ReqCreateOrder = Omit<IOrder, 'author' | 'createdAt' | 'products'> & {
  author: string;
  products: {
    id: string;
    quantity: number;
  }[];
};
