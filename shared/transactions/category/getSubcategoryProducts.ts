import { IProduct } from 'entities/Product';

export interface ResGetSubcategoryProducts {
  products: IProduct[];
  totalCount: number;
}
