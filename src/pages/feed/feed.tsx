import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getAllOrders,
  getAllOrdersSelector
} from '../../services/slices/allOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const isOrdersLoaded = useSelector((state) => state.allOrders.loading);
  useEffect(() => {
    if (!isOrdersLoaded) dispatch(getAllOrders());
  }, [dispatch]);
  const orders: TOrder[] = useSelector(getAllOrdersSelector);
  if (isOrdersLoaded) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getAllOrders());
      }}
    />
  );
};
