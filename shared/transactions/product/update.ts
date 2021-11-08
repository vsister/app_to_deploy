import { IProduct } from 'entities/Product';

export type ReqUpdate = Partial<IProduct> & { id: string };

export type ResUpdate = IProduct;
