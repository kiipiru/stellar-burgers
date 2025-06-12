import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrders } from '../../services/slices/authSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const order = useSelector((state) => state.authorization.userOrders);
  const orders: TOrder[] = order;
  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
