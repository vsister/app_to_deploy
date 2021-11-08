import { OrderService } from '@services/Order/OrderService';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@store';

import { ReqCreateOrder } from 'shared/transactions/order';
import { SuccessResponse } from '@services/Service';

const orderService = new OrderService();

export const createOrder = createAsyncThunk('order/create', async (order: ReqCreateOrder, { getState, dispatch }) => {
  const { jwt } = (getState() as RootState).user.authStatus;

  const response = await orderService.createOrder(order, jwt);

  if (response instanceof SuccessResponse) {
    dispatch(getDocument(response.data.id));
    return response.data;
  }
});

export const getDocument = createAsyncThunk('order/getDocument', async (orderId: string, { getState }) => {
  const { jwt } = (getState() as RootState).user.authStatus;

  const response = await orderService.getDocument(orderId, jwt);
});

export const getUserOrders = createAsyncThunk('order/getUserOrder', async (_, { getState }) => {
  const { _id } = (getState() as RootState).user.data;
  const { jwt } = (getState() as RootState).user.authStatus;

  const response = await orderService.getUserOrders(_id, jwt);

  if (response instanceof SuccessResponse) {
    return response.data;
  }
});

export const getEditorOrders = createAsyncThunk('order/getOrdersByStatus', async (_, { getState }) => {
  const { jwt } = (getState() as RootState).user.authStatus;

  const response = await orderService.getOrders(jwt);

  if (response instanceof SuccessResponse) {
    console.log(response.data);
    return response.data;
  }
});
