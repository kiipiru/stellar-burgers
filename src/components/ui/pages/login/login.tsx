import { FC, useMemo, useState } from 'react';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { LoginUIProps } from './type';
import {
  Touched,
  Focused,
  FormValues,
  useFormValidation
} from '../../../../utils/useFormValidation';
import { useDispatch } from '../../../../services/store';
import { clearError } from '../../../../services/slices/authSlice';

export const LoginUI: FC<LoginUIProps> = ({
  email,
  setEmail,
  errorText,
  handleSubmit,
  password,
  setPassword
}) => {
  const [touched, setTouched] = useState<Touched>({});
  const [focused, setFocused] = useState<Focused>({});
  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFocused((prev) => ({ ...prev, [field]: false }));
  };
  const handleFocus = (field: keyof FormValues) => {
    setFocused((prev) => ({ ...prev, [field]: true }));
  };
  const values = useMemo(() => ({ email, password }), [email, password]);
  const { errors, isValid, isFormValid } = useFormValidation(
    values,
    touched,
    focused
  );
  return (
    <main className={styles.container}>
      <div className={`pt-6 ${styles.wrapCenter}`}>
        <h3 className='pb-6 text text_type_main-medium'>Вход</h3>
        <form
          className={`pb-15 ${styles.form}`}
          name='login'
          onSubmit={handleSubmit}
        >
          <>
            <div className='pb-6'>
              <Input
                type='email'
                placeholder='E-mail'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                name='email'
                error={touched.email ? !isValid.email : false}
                errorText={errors.email}
                size='default'
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
                Войти
              </Button>
            </div>
            {errorText && (
              <p className={`${styles.error} text text_type_main-default pb-6`}>
                {errorText}
              </p>
            )}
          </>
        </form>
        <div className={`pb-4 ${styles.question} text text_type_main-default`}>
          Вы - новый пользователь?
          <Link to='/register' className={`pl-2 ${styles.link}`}>
            Зарегистрироваться
          </Link>
        </div>
        <div className={`${styles.question} text text_type_main-default pb-6`}>
          Забыли пароль?
          <Link to={'/forgot-password'} className={`pl-2 ${styles.link}`}>
            Восстановить пароль
          </Link>
        </div>
      </div>
    </main>
  );
};
