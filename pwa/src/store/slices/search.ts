import { createSlice } from '@reduxjs/toolkit';
import { searchByName } from '@store/thunks/search';
import { IProduct } from 'shared/entities/Product';
import { LoadingStatus } from './user';

export interface SearchState {
  products: IProduct[];
  loading: LoadingStatus;
}

const initialState = {
  products: [],
  loading: LoadingStatus.Initial,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(searchByName.pending, state => {
      state.loading = LoadingStatus.Ongoing;
    });
    builder.addCase(searchByName.fulfilled, (state, action) => {
      state.products = action.payload;
      state.loading = LoadingStatus.Complete;
    });
  },
});
