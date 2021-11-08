import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrder } from 'shared/entities/Order';
import { IProduct } from 'shared/entities/Product';

export interface CartItem {
  product: IProduct;
  quantity: number;
}

export interface CartState {
  cart: CartItem[];
}

const initialState: CartState = {
  cart: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: IProduct; quantity: number }>) => {
      state.cart = [...state.cart, action.payload];
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(cartItem => cartItem.product.id !== action.payload);
    },
    editQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const cartItemToUpdate = state.cart.find(cartItem => cartItem.product.id === action.payload.productId);
      if (cartItemToUpdate) {
        cartItemToUpdate.quantity = action.payload.quantity;
        state.cart = [
          ...state.cart.filter(cartItem => cartItem.product.id !== action.payload.productId),
          cartItemToUpdate,
        ];
      }
    },
  },
});
