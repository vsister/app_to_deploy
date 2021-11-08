import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getProducts } from '@store/thunks/category';
import { LoadingStatus } from './user';
import { ISubcategory } from 'shared/entities/Category';
import { IRangeFilter, IFilter } from 'shared/entities/Specification';
import { IProduct } from 'shared/entities/Product';

export interface IFilters {
  price: IRangeFilter | null;
  specifications?: IFilter[];
}

export interface CategoryState {
  category: ISubcategory | null;
  products: IProduct[];
  totalCount: number;
  page: number;
  inPage: number;
  filters: IFilters | null;
  loading: LoadingStatus;
  error: string;
}

const initialState: CategoryState = {
  category: null,
  products: [],
  totalCount: 0,
  page: 0,
  inPage: 10,
  filters: {
    price: null,
    specifications: [],
  },
  loading: LoadingStatus.Initial,
  error: '',
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<IFilters>) => {
      state.filters = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setInPage: (state, action) => {
      state.inPage = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getProducts.pending, (state, _) => {
      state.loading = LoadingStatus.Ongoing;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      const { products, totalCount } = action.payload;
      state.products = products;
      state.totalCount = totalCount;
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = LoadingStatus.Complete;
    });
  },
});
