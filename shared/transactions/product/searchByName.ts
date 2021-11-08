import { IProduct } from 'entities/Product';

export interface ReqSearchByName {
  name: string;
}

export type ResSearchByName = IProduct[];
