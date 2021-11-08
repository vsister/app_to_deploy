import { IProduct } from 'entities/Product';

export interface ReqGetOne {
  _id: any;
}

export type ResGetOne = IProduct;
