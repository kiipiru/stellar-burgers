import {
  authChecked,
  authorizationReducer,
  changeDataUser,
  clearError,
  getUser,
  getUserOrders,
  loginUser,
  logoutUser,
  registerUser
} from './authSlice';

describe('проверка редьюсера authSlice', () => {
  const initialAuthState = {
    isAuthChecked: false,
    isAuthorized: false,
    error: undefined,
    userData: null,
    userOrders: []
  };
  describe('тесты синхронных экшенов', () => {
    test('подтверждаем, что пользователь авторизован', () => {
      const newState = authorizationReducer(initialAuthState, authChecked());
      const { isAuthChecked } = newState;
      expect(isAuthChecked).toBeTruthy;
    });
    test('удаляем ошибку', () => {
      const newState = authorizationReducer(initialAuthState, clearError());
      const { error } = newState;
      expect(error).toBeUndefined;
    });
  });
  describe('проверка работы асинхронных экшенов слайса', () => {
    const mockUser = {
      user: {
        name: 'Кушаю бургеры',
        email: 'burgerenjoyer@mcdonalds.com',
        password: 'qwerty123'
      },
      orders: [
        {
          _id: '64b8f9e2c4d2a1b3e5f67890',
          status: 'done',
          name: 'Какой-то первый бургер',
          createdAt: '2023-07-20T10:30:45.123Z',
          updatedAt: '2023-07-20T10:45:22.456Z',
          number: 12345,
          ingredients: ['123123', '123654', '756876', '123123']
        },
        {
          _id: '64b8fa15c4d2a1b3e5f67891',
          status: 'pending',
          name: 'Флюоресцентный бургер с кристаллами фалленианского метеорита',
          createdAt: '0001-07-20T11:15:30.789Z',
          updatedAt: '0001-07-20T11:15:30.789Z',
          number: 12346,
          ingredients: ['552331', '654085', '654396', '552331']
        }
      ]
    };

    const tokens = {
      refreshToken: 'полезный рефреш токен',
      accessToken: 'чудесный ассесс токен'
    };
    describe('проверка функции registerUser', () => {
      const errorText = 'Пользователь с таким адресом почты уже существует';
      test('статус pending', () => {
        const newState = authorizationReducer(
          initialAuthState,
          registerUser.pending('pending', mockUser.user)
        );
        const { error } = newState;
        expect(error).toBeUndefined;
      });
      test('возникновение ошибки', () => {
        const newState = authorizationReducer(
          initialAuthState,
          registerUser.rejected(new Error(errorText), 'rejected', mockUser.user)
        );
        const { error } = newState;
        expect(error).toBe(errorText);
      });
    });
    describe('проверка функции loginUser', () => {
      const errorText = 'E-mail и/или пароль указаны неверно';
      test('статус pending', () => {
        const newState = authorizationReducer(
          initialAuthState,
          loginUser.pending('pending', mockUser.user)
        );
        const { error } = newState;
        expect(error).toBeUndefined;
      });
      test('возникновение ошибки', () => {
        const newState = authorizationReducer(
          initialAuthState,
          loginUser.rejected(new Error(errorText), 'rejected', mockUser.user)
        );
        const { error } = newState;
        expect(error).toBe(errorText);
      });
    });
    describe('проверка функции logoutUser', () => {
      const errorText = 'Не удалось выйти из профиля';
      test('статус pending', () => {
        const newState = authorizationReducer(
          initialAuthState,
          logoutUser.pending('pending')
        );
        const { error } = newState;
        expect(error).toBeUndefined;
      });
      test('статус fulfilled', () => {
        const newState = authorizationReducer(
          initialAuthState,
          logoutUser.fulfilled(undefined, 'fulfilled')
        );
        const { isAuthorized, userData } = newState;
        expect(isAuthorized).toBeFalsy;
        expect(userData).toBeNull;
      });
      test('возникновение ошибки', () => {
        const newState = authorizationReducer(
          initialAuthState,
          logoutUser.rejected(new Error(errorText), 'rejected')
        );
        const { error } = newState;
        expect(error).toBe(errorText);
      });
    });
    describe('проверка функции getUser', () => {
      const errorText = 'Не удалось получить информацию о пользователе';
      test('статус pending', () => {
        const newState = authorizationReducer(
          initialAuthState,
          getUser.pending('pending')
        );
        const { error } = newState;
        expect(error).toBeUndefined;
      });
      test('статус fulfilled', () => {
        const newState = authorizationReducer(
          initialAuthState,
          getUser.fulfilled({ user: mockUser.user, success: true }, 'fulfilled')
        );
        const { isAuthorized, userData } = newState;
        expect(isAuthorized).toBeTruthy;
        expect(userData).toEqual(mockUser.user);
      });
      test('возникновение ошибки', () => {
        const newState = authorizationReducer(
          initialAuthState,
          getUser.rejected(new Error(errorText), 'rejected')
        );
        const { error } = newState;
        expect(error).toBe(errorText);
      });
    });
    describe('проверка функции getUserOrders', () => {
      const errorText = 'Не удалось получить информацию о заказах пользователя';
      test('статус pending', () => {
        const newState = authorizationReducer(
          initialAuthState,
          getUserOrders.pending('pending')
        );
        const { error } = newState;
        expect(error).toBeUndefined;
      });
      test('статус fulfilled', () => {
        const newState = authorizationReducer(
          initialAuthState,
          getUserOrders.fulfilled(mockUser.orders, 'fulfilled')
        );
        const { userOrders } = newState;
        expect(userOrders).toEqual(mockUser.orders);
      });
      test('возникновение ошибки', () => {
        const newState = authorizationReducer(
          initialAuthState,
          getUserOrders.rejected(new Error(errorText), 'rejected')
        );
        const { error } = newState;
        expect(error).toBe(errorText);
      });
    });
    describe('проверка функции changeDataUser', () => {
        const errorText = 'Не удалось изменить информацию о пользователе';
        test('статус pending', () => {
          const newState = authorizationReducer(
            initialAuthState,
            changeDataUser.pending('pending', mockUser.user)
          );
          const { error } = newState;
          expect(error).toBeUndefined;
        });
        test('статус fulfilled', () => {
          const newState = authorizationReducer(
            initialAuthState,
            changeDataUser.fulfilled({ user: mockUser.user, success: true }, 'fulfilled', mockUser.user)
          );
          const { userData } = newState;
          expect(userData).toEqual(mockUser.user);
        });
        test('возникновение ошибки', () => {
          const newState = authorizationReducer(
            initialAuthState,
            changeDataUser.rejected(new Error(errorText), 'rejected', mockUser.user)
          );
          const { error } = newState;
          expect(error).toBe(errorText);
        });
      });
  });
});
