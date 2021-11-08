import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IBreadcrumb {
  name: string;
  href: string;
}

export interface BreadcrumbsState {
  path: IBreadcrumb[];
}

const initialState: BreadcrumbsState = {
  path: [],
};

export const breadcrumbsSlice = createSlice({
  name: 'breadcrumbs',
  initialState,
  reducers: {
    setBreadcrumbs: (state, action: PayloadAction<IBreadcrumb[]>) => {
      state.path = action.payload;
    },
  },
});
