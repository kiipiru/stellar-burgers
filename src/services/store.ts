import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsReducer } from './slices/burgerIngredients';
import { orderReducer } from './slices/orderSlice';
import { allOrdersReducer } from './slices/allOrdersSlice';
import { authorizationReducer } from './slices/authSlice';

export const rootReducer = combineReducers({
  burgerIngredients: ingredientsReducer,
  order: orderReducer,
  allOrders: allOrdersReducer,
  authorization: authorizationReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
