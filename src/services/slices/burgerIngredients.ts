import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

type TIngredientsState = {
  ingredients: Array<TIngredient>;
  loading: boolean;
  error: string | undefined;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: undefined
};

export const getIngredients = createAsyncThunk('ingredients/getAll', async () =>
  getIngredientsApi()
);

const burgerIngredientsSlice = createSlice({
  name: 'burgerIngredients',
  initialState,
  reducers: {},
  selectors: { getIngredientsSelector: (state) => state.ingredients },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  }
});

export const getIngredientById = (id: string) => (state: RootState) =>
  state.burgerIngredients.ingredients.find(
    (ingredient: TIngredient) => ingredient._id === id
  );

export const { getIngredientsSelector } = burgerIngredientsSlice.selectors;
export const ingredientsReducer = burgerIngredientsSlice.reducer;
