import {
  forgotPasswordApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

type TAuthState = {
  isAuthChecked: boolean;
  isAuthorized: boolean;
  error: string | undefined;
  userData: TUser | null;
  userOrders: TOrder[];
};
const initialState: TAuthState = {
  isAuthChecked: false,
  isAuthorized: false,
  error: undefined,
  userData: null,
  userOrders: []
};

export const loginUser = createAsyncThunk(
  'authorization/Login',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const response = await loginUserApi({ email, password });
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }
);

export const registerUser = createAsyncThunk(
  'autorization/Register',
  async ({ name, email, password }: TRegisterData) =>
    registerUserApi({ name, email, password })
);

export const getUser = createAsyncThunk('authorization/getUser', async () =>
  getUserApi()
);

export const changeDataUser = createAsyncThunk(
  'authorization/changeDataUser',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const getUserOrders = createAsyncThunk(
  'authorization/getOrders',
  async () => getOrdersApi()
);

export const logoutUser = createAsyncThunk(
  'authorization/logoutUser',
  async () => {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
);

const authorizatiionSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    clearError: (state) => {
      state.error = undefined;
    }
  },
  selectors: {
    getIsAuthorized: (state) => state.isAuthorized,
    getUserInfo: (state) => state.userData,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getAuthError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.error = undefined;
      })
      .addCase(registerUser.rejected, (state) => {
        state.error = 'Пользователь с таким адресом почты уже существует';
      })
      .addCase(loginUser.pending, (state) => {
        state.error = undefined;
      })
      .addCase(loginUser.rejected, (state) => {
        state.error = 'E-mail и/или пароль указаны неверно';
      })
      .addCase(getUser.pending, (state) => {
        state.error = undefined;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthorized = true;
        state.userData = action.payload.user;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.error = undefined;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = undefined;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthorized = false;
        state.userData = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(changeDataUser.pending, (state) => {
        state.error = undefined;
      })
      .addCase(changeDataUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(changeDataUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
      });
  }
});

export const checkUserAuth = createAsyncThunk(
  'authorization/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(getUser()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

export const { getIsAuthorized, getUserInfo, getIsAuthChecked, getAuthError } =
  authorizatiionSlice.selectors;
export const authorizationReducer = authorizatiionSlice.reducer;
export const { authChecked, clearError } = authorizatiionSlice.actions;
