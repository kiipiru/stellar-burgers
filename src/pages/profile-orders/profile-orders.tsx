import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { getUser, getUserOrders } from '../../services/slices/authSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const order = useSelector((state) => state.authorization.userOrders);
  useEffect(() => {
    dispatch(getUserOrders());
  }, []);
  const orders: TOrder[] = order;

  return <ProfileOrdersUI orders={orders} />;
};
