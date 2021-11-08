import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { userSlice } from '@store/slices/user';
import { breadcrumbsSlice } from './slices/breadcrumbs';
import { cartSlice } from './slices/cart';
import { catalogueSlice } from './slices/catalogue';
import { categorySlice } from './slices/category';
import { orderSlice } from './slices/order';
import { productSlice } from './slices/product';
import { searchSlice } from './slices/search';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  cart: cartSlice.reducer,
  catalogue: catalogueSlice.reducer,
  category: categorySlice.reducer,
  product: productSlice.reducer,
  search: searchSlice.reducer,
  breadcrumbs: breadcrumbsSlice.reducer,
  order: orderSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
