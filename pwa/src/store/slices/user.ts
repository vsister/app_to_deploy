import { authenticateUser, verifyToken } from '@store/thunks/user';
import { createSlice } from '@reduxjs/toolkit';
import { UserRole, IEditor, IAdmin, IExpert, IPurchaser } from 'shared/entities/User';
import { IMongooseIdentifiable } from 'shared/entities/Base';

export enum LoadingStatus {
  Initial = 'initial',
  Ongoing = 'ongoing',
  Complete = 'complete',
}

export interface UserState {
  loading: LoadingStatus;
  authStatus: {
    isAuthenticated: boolean;
    jwt: string;
    error: string;
  };
  data: Omit<(IExpert | IPurchaser | IAdmin | IEditor) & IMongooseIdentifiable, 'password'>;
}

const initialState: UserState = {
  loading: LoadingStatus.Initial,
  authStatus: {
    jwt: localStorage.getItem('token') || '',
    isAuthenticated: false,
    error: '',
  },
  data: {
    _id: '',
    orders: {} as any,
    role: UserRole.Purchaser,
    username: '',
    name: '',
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.authStatus.jwt = action.payload;
    },
    expireSession: (state, _) => {
      state.loading = initialState.loading;
      state.authStatus = {
        jwt: '',
        isAuthenticated: false,
        error: 'Период аутентификации истек. Пожалуйста, войдите заново.',
      };
      state.data = initialState.data;
    },
  },
  extraReducers: builder => {
    builder.addCase(authenticateUser.pending, (state, _) => {
      state.loading = LoadingStatus.Ongoing;
    });
    builder.addCase(authenticateUser.fulfilled, (state, action) => {
      state.authStatus = {
        ...state.authStatus,
        isAuthenticated: true,
        error: '',
      };
      state.loading = LoadingStatus.Complete;
    });
    builder.addCase(authenticateUser.rejected, (state, action) => {
      state.authStatus = {
        isAuthenticated: false,
        jwt: '',
        error: action.payload as string,
      };
      state.loading = LoadingStatus.Complete;
    });
    builder.addCase(verifyToken.pending, (state, _) => {
      state.loading = LoadingStatus.Ongoing;
      state.authStatus = {
        ...state.authStatus,
      };
    });
    builder.addCase(verifyToken.rejected, (state, action) => {
      state.authStatus = {
        error: action.payload as string,
        isAuthenticated: false,
        jwt: '',
      };
      state.loading = LoadingStatus.Complete;
    });
    builder.addCase(verifyToken.fulfilled, (state, action) => {
      state.data = action.payload;
      state.authStatus.isAuthenticated = true;
      state.loading = LoadingStatus.Complete;
    });
  },
});
