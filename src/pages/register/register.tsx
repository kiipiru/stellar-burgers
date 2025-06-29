import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearError,
  getAuthError,
  registerUser
} from '../../services/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(getAuthError);
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const userData = { name: userName, email, password };
    dispatch(registerUser(userData)).then((action) => {
      if (registerUser.fulfilled.match(action)) navigate('/login');
    });
  };
  useEffect(() => () => void dispatch(clearError()), [dispatch]);

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
