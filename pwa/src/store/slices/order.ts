import { createSlice } from '@reduxjs/toolkit';
import { getEditorOrders, getUserOrders } from '@store/thunks/order';
import { IOrder } from 'shared/entities/Order';
import { LoadingStatus } from './user';

interface OrderState {
  orders: IOrder[];
  loading: LoadingStatus;
}

const initialState: OrderState = {
  orders: [],
  loading: LoadingStatus.Initial,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUserOrders.pending, (state, _) => {
      state.loading = LoadingStatus.Ongoing;
    });
    builder.addCase(getUserOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
      state.loading = LoadingStatus.Complete;
    });
    builder.addCase(getEditorOrders.pending, (state, _) => {
      state.loading = LoadingStatus.Ongoing;
    });
    builder.addCase(getEditorOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
      state.loading = LoadingStatus.Complete;
    });
  },
});
