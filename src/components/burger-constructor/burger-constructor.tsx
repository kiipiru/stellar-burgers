import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  deleteRequest,
  getIngredientsIds,
  getOrderByNumber,
  submitOrder
} from '../../services/slices/orderSlice';
import { getUserInfo } from '../../services/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bunIng = useSelector((state) => state.order.bun);
  const ingredients = useSelector((state) => state.order.ingredients);
  const constructorItems = {
    bun: bunIng,
    ingredients: ingredients as TConstructorIngredient[]
  };
  const ingredientIds = useSelector(getIngredientsIds);
  const orderRequest = useSelector((state) => state.order.isRequested);

  const orderModalData = useSelector((state) => state.order.order!);
  const user = useSelector(getUserInfo);
  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) {
      return;
    }
    dispatch(submitOrder([bunIng!._id, ...ingredientIds, bunIng!._id])).then(
      (action) => {
        if (submitOrder.fulfilled.match(action)) {
          const orderNumber = action.payload.order.number;
          dispatch(getOrderByNumber(orderNumber!));
        }
      }
    );
  };
  const closeOrderModal = () => {
    dispatch(deleteRequest());
  };
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
