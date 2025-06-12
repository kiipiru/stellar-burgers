import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TOrder } from '@utils-types';

//TODO: починить селекторы и тд с заказом

type TOrderFromServer = {
  name: string | null;
  order: {
    number: number | null;
  };
};

type TOrderState = {
  bun: TIngredient | undefined;
  ingredients: Array<TIngredient>;
  price: number;
  loading: boolean;
  error: string | undefined;
  data: {
    name: string | null;
    order: {
      number: number | null;
    };
  };
  order: TOrder | null;
  isRequested: boolean;
};

const initialState: TOrderState = {
  bun: undefined,
  ingredients: [],
  price: 0,
  loading: false,
  error: undefined,
  data: {
    name: null,
    order: {
      number: null
    }
  },
  order: null,
  isRequested: false
};

export const submitOrder = createAsyncThunk(
  'order/submit',
  async (data: string[]) => orderBurgerApi(data)
);

export const getOrderByNumber = createAsyncThunk(
  'order/getById',
  async (number: number) => getOrderByNumberApi(number)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
    },
    deleteIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },
    moveDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      [state.ingredients[index], state.ingredients[index + 1]] = [
        state.ingredients[index + 1],
        state.ingredients[index]
      ];
    },
    moveUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      [state.ingredients[index], state.ingredients[index - 1]] = [
        state.ingredients[index - 1],
        state.ingredients[index]
      ];
    },
    deleteRequest: (state) => {
      state.isRequested = false;
      state.order = null;
    }
  },
  selectors: {
    getBun: (state) => state.bun,
    getIngredients: (state) => state.ingredients,
    getIngredientsIds: (state) =>
      state.ingredients.map((ingredient) => ingredient._id),
    getPrice: (state) => state.price,
    getData: (state) => state.data
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.order = action.payload.orders[0];
        state.bun = undefined;
        state.ingredients = [];
        state.isRequested = true;
      });
  }
});

export const { getBun, getIngredients, getIngredientsIds, getPrice, getData } =
  orderSlice.selectors;
export const {
  setIngredient,
  deleteIngredient,
  moveUp,
  moveDown,
  deleteRequest
} = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
