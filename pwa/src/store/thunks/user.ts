import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '@services/Auth/AuthService';
import { ErrorResponse, SuccessResponse } from '@services/Service';
import { RootState } from '..';
import { IUser } from 'shared/entities/User';
import { IMongooseIdentifiable } from 'shared/entities/Base';
import { UserService } from '@services/User/UserService';
import { userSlice } from '@store/slices/user';

const authService = new AuthService();
const userService = new UserService();

interface Credentials {
  username: string;
  password: string;
}

export const authenticateUser = createAsyncThunk(
  'user/authenticate',
  async (credentials: Credentials, { dispatch, rejectWithValue }) => {
    const { username, password } = credentials;
    const response = await authService.authenticate(username, password);

    if (response instanceof SuccessResponse) {
      const token = await response.data;

      localStorage.setItem('token', token);

      dispatch(userSlice.actions.setToken(token));

      return dispatch(verifyToken());
    }

    if (response instanceof ErrorResponse) {
      return rejectWithValue('Неверный юзернейм или пароль.');
    }

    return rejectWithValue('Произошла критическая ошибка. Пожалуйста, перезагрузите страницу.');
  }
);

export const createUser = createAsyncThunk('user/create', async (user: IUser, { getState, rejectWithValue }) => {
  const { jwt } = (getState() as RootState).user.authStatus;

  const response = await userService.create(user, jwt);

  if (response instanceof SuccessResponse) {
    alert('Пользователь успешно создан!');
    window.location.href = '/user';
    return;
  }

  if (response instanceof ErrorResponse) {
    return rejectWithValue(response.error);
  }
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (payload: { id: string; user: IUser }, { getState, rejectWithValue }) => {
    const { jwt } = (getState() as RootState).user.authStatus;

    const response = await userService.update(payload.id, payload.user, jwt);

    if (response instanceof SuccessResponse) {
      alert('Пользователь успешно обновлен!');
      window.location.href = '/user';
      return;
    }

    if (response instanceof ErrorResponse) {
      return rejectWithValue(response.error);
    }
  }
);

export const verifyToken = createAsyncThunk('user/verifyToken', async (_, { getState, rejectWithValue }) => {
  const { jwt } = (getState() as RootState).user.authStatus;

  const response = await userService.getUser(jwt);

  if (response instanceof SuccessResponse) {
    const user = await response.data;

    if (!user) {
      return rejectWithValue('Произошла критическая ошибка. Пожалуйста, перезагрузите страницу.');
    }

    return user;
  }

  if (response instanceof ErrorResponse) {
    return rejectWithValue('Период аутентификации истек. Необходимо войти заново.');
  }
});
