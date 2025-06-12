import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

type TAllOrdersState = {
  orders: TOrdersData;
  loading: boolean;
  error: string | undefined;
};

const initialState: TAllOrdersState = {
  orders: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: undefined
};

export const getAllOrders = createAsyncThunk('orders/getAll', async () =>
  getFeedsApi()
);

const allOrdersSlice = createSlice({
  name: 'allOrders',
  initialState,
  reducers: {},
  selectors: {
    getAllOrdersSelector: (state) => state.orders.orders,
    getFeed: (state) => ({
      total: state.orders.total,
      totalToday: state.orders.totalToday
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(
        getAllOrders.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      );
  }
});

export const { getAllOrdersSelector, getFeed } = allOrdersSlice.selectors;
export const allOrdersReducer = allOrdersSlice.reducer;
