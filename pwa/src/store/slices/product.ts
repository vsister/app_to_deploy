import { createSlice } from '@reduxjs/toolkit';
import { getProduct, getAllProducts } from '@store/thunks/product';
import { IProduct } from 'shared/entities/Product';
import { SpecificationType } from 'shared/entities/Specification';
import { LoadingStatus } from './user';

export interface ProductState {
  product: IProduct | null;
  products: IProduct[];
  loading: LoadingStatus;
}

const initialState: ProductState = {
  product: null,
  products: [],
  loading: LoadingStatus.Initial,
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getProduct.pending, state => {
      state.loading = LoadingStatus.Ongoing;
    });
    builder.addCase(getProduct.fulfilled, (state, action) => {
      state.product = action.payload;
      state.loading = LoadingStatus.Complete;
    });
    builder.addCase(getAllProducts.pending, state => {
      state.loading = LoadingStatus.Ongoing;
    });
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.products = action.payload;
      state.loading = LoadingStatus.Complete;
    });
  },
});
