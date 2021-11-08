import { IProduct } from 'entities/Product';

export type ReqCreate = Omit<IProduct, 'breadcrumbs'> & { price: number };

export type ResCreate = IProduct;
