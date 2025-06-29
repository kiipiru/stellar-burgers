import { getIngredients, ingredientsReducer } from "./burgerIngredients";


describe('Проверка редьюсера burgerIngredients', () => {
  const initialIngredientsState = {
    ingredients: [],
    loading: false,
    error: undefined
  };
  describe('Проверка асинхронных редьюсеров', () => {
    const mockIngredientsResponse = {
        ingredients: [{
          _id: "643d69a5c3f7b9001cfa093c",
          name: "Мягкая булка",
          type: "bun",
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: "https://code.s3.yandex.net/react/code/bun-02.png",
          image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
          image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
          __v: 0
        },
        {
          _id: "643d69a5c3f7b9001cfa0943",
          name: "Вкусный соус",
          type: "sauce",
          proteins: 50,
          fat: 22,
          carbohydrates: 11,
          calories: 14,
          price: 80,
          image: "https://code.s3.yandex.net/react/code/sauce-04.png",
          image_mobile: "https://code.s3.yandex.net/react/code/sauce-04-mobile.png",
          image_large: "https://code.s3.yandex.net/react/code/sauce-04-large.png",
          __v: 0
        },
      ]};
    describe('проверка функции getIngredients', () => {
      const errorText = 'Не удалось получить ингредиенты';
      test('статус pending', () => {
        const newState = ingredientsReducer(
          initialIngredientsState,
          getIngredients.pending('pending')
        );
        const {error, loading} = newState
        expect(error).toBeUndefined
        expect(loading).toBeTruthy
      });
      test('статус fulfilled', () => {
        const newState = ingredientsReducer(
          initialIngredientsState,
          getIngredients.fulfilled(mockIngredientsResponse.ingredients, 'pending')
        );
        const {ingredients, loading} = newState
        expect(loading).toBeFalsy
        expect(ingredients).toEqual(mockIngredientsResponse.ingredients)
      });
      test('возникновение ошибки', () => {
        const newState = ingredientsReducer(
            initialIngredientsState,
            getIngredients.rejected(new Error(errorText), 'rejected')
          );
          const {error, loading} = newState
          expect(error).toBe(errorText)
          expect(loading).toBeFalsy
      })
    });
  });
});
