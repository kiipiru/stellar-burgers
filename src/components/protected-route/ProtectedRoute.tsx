import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getIsAuthChecked, getUserInfo } from '../../services/slices/authSlice';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(getIsAuthChecked);
  const user = useSelector(getUserInfo);
  const location = useLocation();
  console.log(user);
  if (!isAuthChecked) {
    return <Preloader />;
  }
  if (!onlyUnAuth && !user)
    return <Navigate replace to='/login' state={{ from: location }} />;
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }
  return children;
};
