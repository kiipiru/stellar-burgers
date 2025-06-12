import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const order = useSelector((state) => state.authorization.userOrders);
  const orders: TOrder[] = order;

  return <ProfileOrdersUI orders={orders} />;
};
