import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getAuthError,
  getUser,
  loginUser
} from '../../services/slices/authSlice';
import { clearError } from '../../services/slices/authSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useSelector(getAuthError);
  const dispatch = useDispatch();
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const data = { email, password };
    dispatch(loginUser(data)).then((action) => {
      if (loginUser.fulfilled.match(action)) dispatch(getUser());
    });
  };
  useEffect(() => () => {
    dispatch(clearError());
  }),
    [dispatch];
  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
