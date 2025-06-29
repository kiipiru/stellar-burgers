import {
  orderReducer,
  setIngredient,
  deleteIngredient,
  moveUp,
  moveDown,
  deleteRequest,
  getOrderByNumber,
  submitOrder
} from './orderSlice';

describe('проверка редьюсера orderSlice', () => {
  const mockOrder = {
    _id: '665f1ab8c3a9be001e2d4b77',
    status: 'fulfilled',
    name: 'Бургер (может быть уже не очень вкусный)',
    createdAt: '1995-06-29T12:34:56.789Z',
    updatedAt: '1995-06-29T12:40:00.000Z',
    number: 12345,
    ingredients: [
      '643d69a5c3f7b9001cfa093c', // булка
      '643d69a5c3f7b9001cfa0940' // мясо
    ]
  };

  const initialIngredientsState = {
    ingredients: [
      {
        _id: '643d69a5c3f7b9001cfa0943',
        name: 'Вкусный соус',
        type: 'sauce',
        proteins: 50,
        fat: 22,
        carbohydrates: 11,
        calories: 14,
        price: 80,
        image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
        key: '',
        id: '1'
      },
      {
        _id: '643d69a5c3f7b9001cfa0940',
        name: 'Говяжий метеорит (отбивная)',
        type: 'main',
        proteins: 800,
        fat: 800,
        carbohydrates: 300,
        calories: 2674,
        price: 3000,
        image: 'https://code.s3.yandex.net/react/code/meat-04.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
        key: '',
        id: '2'
      }
    ],
    bun: {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Мягкая булка',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0
    },
    price: 4255,
    loading: false,
    error: undefined,
    order: mockOrder,
    isRequested: true
  };
  describe('тесты синхронных экшенов', () => {
    test('добавить ингредиент', () => {
      const newState = orderReducer(
        initialIngredientsState,
        setIngredient({
          _id: '1',
          name: 'Сочный огурец',
          type: 'main',
          proteins: 1,
          fat: 1,
          carbohydrates: 1,
          calories: 1,
          price: 1,
          image: '',
          image_large: '',
          image_mobile: ''
        })
      );
      const { ingredients } = newState;
      expect(ingredients).toEqual([
        ...initialIngredientsState.ingredients,
        expect.objectContaining({
          _id: '1',
          name: 'Сочный огурец',
          type: 'main',
          proteins: 1,
          fat: 1,
          carbohydrates: 1,
          calories: 1,
          price: 1,
          image: '',
          image_large: '',
          image_mobile: ''
        })
      ]);
    });
    test('удалить ингредиент', () => {
      const newState = orderReducer(
        initialIngredientsState,
        deleteIngredient('2')
      );
      const { ingredients } = newState;
      expect(ingredients).toEqual([
        {
          _id: '643d69a5c3f7b9001cfa0943',
          name: 'Вкусный соус',
          type: 'sauce',
          proteins: 50,
          fat: 22,
          carbohydrates: 11,
          calories: 14,
          price: 80,
          image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/sauce-04-large.png',
          key: '',
          id: '1'
        }
      ]);
    });
    test('двигаем ингредиент вверх', () => {
      const newState = orderReducer(initialIngredientsState, moveUp(1)); // двигаем второй по счету ингредиент вверх
      const { ingredients } = newState;
      expect(ingredients).toEqual([
        initialIngredientsState.ingredients[1],
        initialIngredientsState.ingredients[0]
      ]);
    });
    test('двигаем ингредиент вниз', () => {
      const newState = orderReducer(initialIngredientsState, moveDown(0)); // двигаем первый по счету ингредиент вниз
      const { ingredients } = newState;
      expect(ingredients).toEqual([
        initialIngredientsState.ingredients[1],
        initialIngredientsState.ingredients[0]
      ]);
    });
    test('проверяем удаление запроса информации о заказе', () => {
      const newState = orderReducer(initialIngredientsState, deleteRequest());
      const { isRequested, order } = newState;
      expect(order).toBeNull();
      expect(isRequested).toBeFalsy();
    });
  });
  describe('проверка работы асинхронных экшенов слайса', () => {
    const mockOrdersResponse = {
      orders: [
        {
          _id: '665f1ab8c3a9be001e2d4b77',
          status: 'fulfilled',
          name: 'Бургер (может быть уже не очень вкусный)',
          createdAt: '1995-06-29T12:34:56.789Z',
          updatedAt: '1995-06-29T12:40:00.000Z',
          number: 12345,
          ingredients: [
            '643d69a5c3f7b9001cfa093c',
            '643d69a5c3f7b9001cfa0940',
            '643d69a5c3f7b9001cfa093c'
          ]
        }
      ]
    };
    describe('проверка функции getOrderByNumber', () => {
      const errorText = 'Не удалось получить заказ';
      test('статус pending', () => {
        const newState = orderReducer(
          initialIngredientsState,
          getOrderByNumber.pending(
            'pending',
            mockOrdersResponse.orders[0].number
          )
        );
        const { loading, error } = newState;
        expect(loading).toBeTruthy;
        expect(error).toBeUndefined;
      });
      test('статус fulfilled', () => {
        const newState = orderReducer(
          initialIngredientsState,
          getOrderByNumber.fulfilled(
            { orders: mockOrdersResponse.orders, success: true },
            'fulfilled',
            mockOrdersResponse.orders[0].number
          )
        );
        const { loading, bun, ingredients, isRequested } = newState;
        expect(loading).toBeFalsy;
        expect(bun).toBeUndefined, expect(ingredients).toEqual([]);
        expect(isRequested).toBeTruthy;
      });
      test('возникновение ошибки', () => {
        const newState = orderReducer(
          initialIngredientsState,
          getOrderByNumber.rejected(
            new Error(errorText),
            'rejected',
            mockOrdersResponse.orders[0].number
          )
        );
        const { loading, error } = newState;
        expect(loading).toBeFalsy;
        expect(error).toBe(errorText);
      });
    });
    describe('проверка функции submitOrder', () => {
      const errorText = 'Не удалось отправить заказ';
      test('статус pending', () => {
        const newState = orderReducer(
          initialIngredientsState,
          submitOrder.pending(
            'pending',
            mockOrdersResponse.orders[0].ingredients
          )
        );
        const { loading, error } = newState;
        expect(loading).toBeTruthy;
        expect(error).toBeUndefined;
      });
      test('статус fulfilled', () => {
        const newState = orderReducer(
          initialIngredientsState,
          submitOrder.fulfilled(
            {
              order: mockOrdersResponse.orders[0],
              name: 'Заказик',
              success: true
            },
            'fulfilled',
            mockOrdersResponse.orders[0].ingredients
          )
        );
        const { loading } = newState;
        expect(loading).toBeFalsy;
      });

      test('возникновение ошибки', () => {
        const newState = orderReducer(
          initialIngredientsState,
          submitOrder.rejected(
            new Error(errorText),
            'rejected',
            mockOrdersResponse.orders[0].ingredients
          )
        );
        const { loading, error } = newState;
        expect(loading).toBeFalsy;
        expect(error).toBe(errorText);
      });
    });
  });
});
