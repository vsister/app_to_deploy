import { createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryService, GetProductsParams } from '@services/Category/CategoryService';
import { ErrorResponse, ResponseStatus, SuccessResponse } from '@services/Service';
import { RootState } from '@store';
import { userSlice } from '@store/slices/user';

const categoryService = new CategoryService();

export interface GetProductsPayload {
  categoryId: string;
  subcategoryId: string;
  params: GetProductsParams;
}

export const getProducts = createAsyncThunk(
  'category/products/get',
  async (payload: GetProductsPayload, { getState, dispatch, rejectWithValue }) => {
    const { categoryId, subcategoryId, params } = payload;
    const { user, catalogue } = getState() as RootState;

    const { jwt } = user.authStatus;

    if (!catalogue.currentGroup) {
      return rejectWithValue('Не выбрана активная группа');
    }

    const { id: groupId } = catalogue.currentGroup;

    const response = await categoryService.getProducts(
      {
        groupId,
        parentId: categoryId,
        categoryId: subcategoryId,
      },
      jwt,
      params
    );

    if (response instanceof SuccessResponse) {
      return response.data;
    }

    if (response instanceof ErrorResponse) {
      switch (response.status) {
        case ResponseStatus.Unauthorized:
          dispatch(userSlice.actions.expireSession('Ошибка аутентификации - необходимо войти заново.'));
          break;
        default:
          return rejectWithValue(response.status);
      }
      return rejectWithValue(response.status);
    }
  }
);
