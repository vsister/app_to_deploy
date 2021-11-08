import { createAsyncThunk } from '@reduxjs/toolkit';
import { CatalogueService } from '@services/Catalogue/CatalogueService';
import { ErrorResponse, ResponseStatus, SuccessResponse } from '@services/Service';
import { userSlice } from '@store/slices/user';
import { RootState } from '..';

const catalogueService = new CatalogueService();

export const getCatalogue = createAsyncThunk('catalogue/get', async (_, { getState, dispatch, rejectWithValue }) => {
  const { jwt } = (getState() as RootState).user.authStatus;

  const response = await catalogueService.getCatalogue(jwt);

  if (response instanceof SuccessResponse) {
    return response.data.groups;
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

  return rejectWithValue('Произошла неизвестная ошибка. Пожалуйста, перезагрузите страницу.');
});

export const createGroup = createAsyncThunk(
  'catalogue/group/create',
  async (name: string, { getState, dispatch, rejectWithValue }) => {
    const { jwt } = (getState() as RootState).user.authStatus;

    const response = await catalogueService.createGroup(name, jwt);

    if (response instanceof SuccessResponse) {
      alert('Группа успешно создана!');
      window.location.href = '/';
      return;
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

export const updateGroup = createAsyncThunk(
  'catalgoue/group/edit',
  async (payload: { id: string; name: string }, { getState, dispatch, rejectWithValue }) => {
    const { jwt } = (getState() as RootState).user.authStatus;

    const response = await catalogueService.updateGroup(payload.id, payload.name, jwt);

    if (response instanceof SuccessResponse) {
      alert('Группа успешно изменена!');
      window.location.href = '/';
      return;
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

export const deleteGroup = createAsyncThunk(
  'catalogue/group/delete',
  async (id: string, { getState, dispatch, rejectWithValue }) => {
    const { jwt } = (getState() as RootState).user.authStatus;

    const response = await catalogueService.deleteGroup(id, jwt);

    if (response instanceof SuccessResponse) {
      alert('Группа успешно удалена!');
      window.location.href = '/';
      return;
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

export const createCategory = createAsyncThunk(
  'catalogue/category/create',
  async (payload: { groupId: string; name: string }, { getState, dispatch, rejectWithValue }) => {
    const { jwt } = (getState() as RootState).user.authStatus;

    const response = await catalogueService.createCategory(payload.groupId, payload.name, jwt);

    if (response instanceof SuccessResponse) {
      alert('Категория успешно создана!');
      window.location.href = '/';
      return;
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

export const updateCategory = createAsyncThunk(
  'catalogue/category/update',
  async (payload: { id: string; name: string }, { getState, dispatch, rejectWithValue }) => {
    const { jwt } = (getState() as RootState).user.authStatus;

    const response = await catalogueService.updateCategory(payload.id, payload.name, jwt);

    if (response instanceof SuccessResponse) {
      alert('Катгория успешно изменена!');
      window.location.href = '/';
      return;
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

export const deleteCategory = createAsyncThunk(
  'catalogue/category/delete',
  async (id: string, { getState, dispatch, rejectWithValue }) => {
    const { jwt } = (getState() as RootState).user.authStatus;

    const response = await catalogueService.deleteCategory(id, jwt);

    if (response instanceof SuccessResponse) {
      alert('Категория успешно удалена!');
      window.location.href = '/';
      return;
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

export const createSubcategory = createAsyncThunk(
  'catalogue/subcategory/create',
  async (payload: { groupId: string; categoryId: string; data: any }, { getState, dispatch, rejectWithValue }) => {
    const { jwt } = (getState() as RootState).user.authStatus;

    const response = await catalogueService.createSubcategory(payload.groupId, payload.categoryId, payload.data, jwt);

    if (response instanceof SuccessResponse) {
      alert('Подкатегория успешно создана!');
      window.location.href = '/';
      return;
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

export const updateSubcategory = createAsyncThunk(
  'catalogue/subcategory/update',
  async (payload: { id: string; data: any }, { getState, dispatch, rejectWithValue }) => {
    const { jwt } = (getState() as RootState).user.authStatus;

    const response = await catalogueService.updateSubcategory(payload.id, payload.data, jwt);

    if (response instanceof SuccessResponse) {
      alert('Подкатегория успешно изменена!');
      window.location.href = '/';
      return;
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

export const deleteSubcategory = createAsyncThunk(
  'catalogue/subcategory/delete',
  async (id: string, { getState, dispatch, rejectWithValue }) => {
    const { jwt } = (getState() as RootState).user.authStatus;

    const response = await catalogueService.deleteCategory(id, jwt);

    if (response instanceof SuccessResponse) {
      alert('Подкатегория успешно удалена!');
      window.location.href = '/';
      return;
    }

    if (response instanceof ErrorResponse) {
      switch (response.status) {
        case ResponseStatus.Unauthorized:
          dispatch(userSlice.actions.expireSession({}));
          break;
        default:
          alert('Произошла неизвестная ошибка. Пожалуйста, перезагругите страницу.');
          return rejectWithValue('Произошла неизвестная ошибка. Пожалуйста, перезагрузите страницу.');
      }
    }
  }
);
