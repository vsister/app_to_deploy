import { LoadingStatus } from './user';
import { ICategoryGroup, IParentCategory, ISubcategory } from 'shared/entities/Category';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCatalogue } from '@store/thunks/catalogue';
import { ResponseStatus } from '@services/Service';

export interface CatalogueState {
  loading: LoadingStatus;
  groups: ICategoryGroup[];
  currentGroup: ICategoryGroup | null;
  currentCategory: IParentCategory | null;
  currentSubcategory: ISubcategory | null;
  error: string;
}

const initialState: CatalogueState = {
  loading: LoadingStatus.Initial,
  groups: [],
  currentGroup: null,
  currentCategory: null,
  currentSubcategory: null,
  error: '',
};

export const catalogueSlice = createSlice({
  name: 'catalogue',
  initialState,
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setCurrentGroup: (state, action: PayloadAction<ICategoryGroup>) => {
      state.currentGroup = action.payload;
    },
    setCurrentCategory: (state, action: PayloadAction<IParentCategory>) => {
      state.currentCategory = action.payload;
    },
    setCurrentSubcategory: (state, action: PayloadAction<ISubcategory>) => {
      state.currentSubcategory = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getCatalogue.pending, state => {
      state.loading = LoadingStatus.Ongoing;
    });
    builder.addCase(getCatalogue.fulfilled, (state, action) => {
      state.groups = action.payload;
      state.loading = LoadingStatus.Complete;
    });
    builder.addCase(getCatalogue.rejected, (state, action) => {});
  },
});
