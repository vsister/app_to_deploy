import string from '*.png';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CatalogueService } from '@services/Catalogue/CatalogueService';
import { ProductService } from '@services/Product/ProductService';
import { ErrorResponse, ResponseStatus, SuccessResponse } from '@services/Service';
import { RootState } from '@store';
import { userSlice } from '@store/slices/user';
import { StringLocale } from 'yup/lib/locale';

const catalogueService = new CatalogueService();
const productService = new ProductService();

export const getProduct = createAsyncThunk('product/get', async (id: string, { getState }) => {
  const { jwt } = (getState() as RootState).user.authStatus;

  const response = await productService.getOne(id, jwt);

  if (response instanceof SuccessResponse) {
    return response.data;
  }
});

export const getAllProducts = createAsyncThunk('product/getMany', async (_, { getState }) => {
  const { jwt } = (getState() as RootState).user.authStatus;

  const response = await productService.getAll(jwt);

  if (response instanceof SuccessResponse) {
    return response.data;
  }
});

export const createProduct = createAsyncThunk(
  'product/create',
  async (
    payload: { groupId: string; categoryId: string; subcategoryId: string; body: any },
    { getState, dispatch, rejectWithValue }
  ) => {
    const { groupId, categoryId, subcategoryId, body } = payload;
    const { jwt } = (getState() as RootState).user.authStatus;

    const response = await catalogueService.createProduct(groupId, categoryId, subcategoryId, body, jwt);

    if (response instanceof SuccessResponse) {
      alert('Позиция успешно создана!');
      window.location.href = `/category/${categoryId}/subcategory/${subcategoryId}`;
    }

    if (response instanceof ErrorResponse) {
      switch (response.status) {
        case ResponseStatus.Unauthorized:
          dispatch(userSlice.actions.expireSession({}));
          break;
        default:
          return rejectWithValue('Произошла неизвестная ошибка. Пожалуйста, перезагрузите страницу.');
      }
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/update',
  async (
    payload: { categoryId: string; subcategoryId: string; productId: string; body: any },
    { getState, dispatch, rejectWithValue }
  ) => {
    const { categoryId, subcategoryId, productId, body } = payload;
    const { jwt } = (getState() as RootState).user.authStatus;

    const response = await productService.update(productId, body, jwt);

    if (response instanceof SuccessResponse) {
      alert('Позиция успешно обновлена!');
      window.location.href = `/category/${categoryId}/subcategory/${subcategoryId}`;
    }

    if (response instanceof ErrorResponse) {
      switch (response.status) {
        case ResponseStatus.Unauthorized:
          dispatch(userSlice.actions.expireSession({}));
          break;
        default:
          return rejectWithValue('Произошла неизвестная ошибка. Пожалуйста, перезагрузите страницу.');
      }
    }
  }
);
