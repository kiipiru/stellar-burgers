import { FC, useMemo, useState } from 'react';

import { Input, Button } from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { PageUIProps } from '../common-type';
import {
  Touched,
  Focused,
  FormValues,
  useFormValidation
} from '../../../../utils/useFormValidation';

export const ForgotPasswordUI: FC<PageUIProps> = ({
  errorText,
  email,
  setEmail,
  handleSubmit
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
  const values = useMemo(() => ({ email }), [email]);
  const { errors, isValid, isFormValid } = useFormValidation(
    values,
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
          <div className={`pb-6 ${styles.button}`}>
            <Button
              disabled={!isFormValid}
              type='primary'
              size='medium'
              htmlType='submit'
            >
              Восстановить
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
          <Link to={'/login'} className={`pl-2 ${styles.link}`}>
            Войти
          </Link>
        </div>
      </div>
    </main>
  );
};
