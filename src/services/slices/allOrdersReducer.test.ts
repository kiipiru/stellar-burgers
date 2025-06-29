import { allOrdersReducer, getAllOrders } from './allOrdersSlice';

describe('Проверка редьюсера allOrders', () => {
  const initialOrdersState = {
    orders: {
      orders: [],
      total: 0,
      totalToday: 0
    },
    loading: false,
    error: undefined
  };
  describe('Проверка асинхронных редьюсеров', () => {
    const mockAllOrdersResponse = {
      orders: [
        {
          _id: '507f1f77bcf86cd799439011',
          status: 'done',
          name: 'Флюоресцентный бургер',
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:35:00.000Z',
          number: 12345,
          ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c7']
        },
        {
          _id: '507f1f77bcf86cd799439012',
          status: 'pending',
          name: 'Космический чизбургер',
          createdAt: '2024-01-15T11:00:00.000Z',
          updatedAt: '2024-01-15T11:05:00.000Z',
          number: 12346,
          ingredients: ['60d3b41abdacab0026a733c8', '60d3b41abdacab0026a733c9']
        }
      ],
      total: 250,
      totalToday: 15
    };
    describe('проверка функции getAllOrders', () => {
      const errorText = 'Не удалось получить заказы';
      test('статус pending', () => {
        const newState = allOrdersReducer(
          initialOrdersState,
          getAllOrders.pending('pending')
        );
        const { error, loading } = newState;
        expect(error).toBeUndefined;
        expect(loading).toBeTruthy;
      });
      test('статус fulfilled', () => {
        const newState = allOrdersReducer(
          initialOrdersState,
          getAllOrders.fulfilled(
            {
              orders: mockAllOrdersResponse.orders,
              total: mockAllOrdersResponse.total,
              totalToday: mockAllOrdersResponse.totalToday,
              success: true
            },
            'pending'
          )
        );
        const { orders, loading } = newState;
        expect(loading).toBeFalsy;
        expect(orders.orders).toEqual(mockAllOrdersResponse.orders);
        expect(orders.total).toEqual(mockAllOrdersResponse.total);
        expect(orders.totalToday).toEqual(mockAllOrdersResponse.totalToday);
      });
      test('возникновение ошибки', () => {
        const newState = allOrdersReducer(
          initialOrdersState,
          getAllOrders.rejected(new Error(errorText), 'rejected')
        );
        const { error, loading } = newState;
        expect(error).toBe(errorText);
        expect(loading).toBeFalsy;
      });
    });
  });
});
