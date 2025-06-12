import { FC, useState } from 'react';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { ResetPasswordUIProps } from './type';
import {
  Touched,
  Focused,
  FormValues,
  useFormValidation
} from '../../../../utils/useFormValidation';

export const ResetPasswordUI: FC<ResetPasswordUIProps> = ({
  errorText,
  password,
  setPassword,
  handleSubmit,
  token,
  setToken
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
  const { errors, isValid, isFormValid } = useFormValidation(
    { token, password },
    touched,
    focused
  );
  return (
    <main className={styles.container}>
      <div className={`pt-6 ${styles.wrapCenter}`}>
        <h3 className='pb-6 text text_type_main-medium'>
          Восстановление пароля
        </h3>
        <form
          className={`pb-15 ${styles.form}`}
          name='login'
          onSubmit={handleSubmit}
        >
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
          <div className='pb-6'>
            <Input
              type='text'
              placeholder='Введите код из письма'
              onChange={(e) => setToken(e.target.value)}
              value={token}
              name='token'
              error={touched.token ? !isValid.token : false}
              errorText={errors.token}
              size='default'
              onBlur={() => handleBlur('token')}
              onFocus={() => handleFocus('token')}
            />
          </div>
          <div className={`pb-6 ${styles.button}`}>
            <Button
              disabled={!isFormValid}
              type='primary'
              size='medium'
              htmlType='submit'
            >
              Сохранить
            </Button>
          </div>
          {errorText && (
            <p className={`${styles.error} text text_type_main-default pb-6`}>
              {errorText}
            </p>
          )}
        </form>
        <div className={`${styles.question} text text_type_main-default pb-6`}>
          Вспомнили пароль?
          <Link to='/login' className={`pl-2 ${styles.link}`}>
            Войти
          </Link>
        </div>
      </div>
    </main>
  );
};
