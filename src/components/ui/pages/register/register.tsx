import { FC, useEffect, useMemo, useState } from 'react';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { RegisterUIProps } from './type';
import {
  Focused,
  FormValues,
  Touched,
  useFormValidation
} from '../../../../utils/useFormValidation';
import { useDispatch } from '../../../../services/store';
import { clearError } from '../../../../services/slices/authSlice';

export const RegisterUI: FC<RegisterUIProps> = ({
  errorText,
  email,
  setEmail,
  handleSubmit,
  password,
  setPassword,
  userName,
  setUserName
}) => {
  const [touched, setTouched] = useState<Touched>({});
  const [focused, setFocused] = useState<Focused>({});
  const dispatch = useDispatch();
  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFocused((prev) => ({ ...prev, [field]: false }));
  };
  const handleFocus = (field: keyof FormValues) => {
    setFocused((prev) => ({ ...prev, [field]: true }));
  };
  const values = useMemo(
    () => ({ email, password, name: userName }),
    [email, password, userName]
  );
  const { errors, isValid, isFormValid } = useFormValidation(
    values,
    touched,
    focused
  );
  useEffect(() => () => void dispatch(clearError()), [dispatch]);
  return (
    <main className={styles.container}>
      <div className={`pt-6 ${styles.wrapCenter}`}>
        <h3 className='pb-6 text text_type_main-medium'>Регистрация</h3>
        <form
          className={`pb-15 ${styles.form}`}
          name='register'
          onSubmit={handleSubmit}
        >
          <>
            <div className='pb-6'>
              <Input
                type='text'
                placeholder='Имя'
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
                name='name'
                error={touched.name ? !isValid.name : false}
                errorText={errors.name}
                size='default'
                onBlur={() => handleBlur('name')}
                onFocus={() => handleFocus('name')}
              />
            </div>
            <div className='pb-6'>
              <Input
                type='email'
                placeholder='E-mail'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                name={'email'}
                error={touched.email ? !isValid.email : false}
                errorText={errors.email}
                size={'default'}
                onBlur={() => handleBlur('email')}
                onFocus={() => handleFocus('email')}
              />
            </div>
            <div className='pb-6'>
              {/* Заменил passwordInput на обычный для интуитивного поведения хука*/}
              <Input
                type='password'
                placeholder='Пароль'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                name={'password'}
                error={touched.password ? !isValid.password : false}
                errorText={errors.password}
                size={'default'}
                onBlur={() => handleBlur('password')}
                onFocus={() => handleFocus('password')}
              />
            </div>
            <div className={`pb-6 ${styles.button}`}>
              <Button
                disabled={!isFormValid}
                type='primary'
                size='medium'
                htmlType='submit'
              >
                Зарегистрироваться
              </Button>
            </div>
            {errorText && (
              <p className={`${styles.error} text text_type_main-default pb-6`}>
                {errorText}
              </p>
            )}
          </>
        </form>
        <div className={`${styles.question} text text_type_main-default pb-6`}>
          Уже зарегистрированы?
          <Link to='/login' className={`pl-2 ${styles.link}`}>
            Войти
          </Link>
        </div>
      </div>
    </main>
  );
};
