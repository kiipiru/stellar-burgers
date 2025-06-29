import { FC, useMemo, useState } from 'react';

import { Button, Input } from '@zlden/react-developer-burger-ui-components';
import styles from './profile.module.css';
import commonStyles from '../common.module.css';

import { ProfileUIProps } from './type';
import { ProfileMenu } from '@components';
import {
  Touched,
  Focused,
  FormValues,
  useFormValidation
} from '../../../../utils/useFormValidation';

export const ProfileUI: FC<ProfileUIProps> = ({
  formValue,
  isFormChanged,
  updateUserError,
  handleSubmit,
  handleCancel,
  handleInputChange
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
  const values = useMemo(
    () => ({
      email: formValue.email,
      password: formValue.password,
      name: formValue.name
    }),
    [formValue.email, formValue.password, formValue.name]
  );
  const { errors, isValid, isFormValid } = useFormValidation(
    values,
    touched,
    focused,
    { passwordNotRequired: true }
  );
  return (
    <main className={`${commonStyles.container}`}>
      <div className={`mt-30 mr-15 ${styles.menu}`}>
        <ProfileMenu />
      </div>
      <form
        className={`mt-30 ${styles.form} ${commonStyles.form}`}
        onSubmit={handleSubmit}
      >
        <>
          <div className='pb-6'>
            <Input
              type={'text'}
              placeholder={'Имя'}
              onChange={handleInputChange}
              value={formValue.name}
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
              type={'email'}
              placeholder={'E-mail'}
              onChange={handleInputChange}
              value={formValue.email}
              name={'email'}
              error={touched.email ? !isValid.email : false}
              errorText={errors.email}
              size={'default'}
              onBlur={() => handleBlur('email')}
              onFocus={() => handleFocus('email')}
            />
          </div>
          <div className='pb-6'>
            <Input
              type={'password'}
              placeholder={'Пароль'}
              onChange={handleInputChange}
              value={formValue.password}
              name={'password'}
              error={touched.password ? !isValid.password : false}
              errorText={errors.password}
              size={'default'}
              onBlur={() => handleBlur('password')}
              onFocus={() => handleFocus('password')}
            />
          </div>
          {isFormChanged && (
            <div className={styles.button}>
              <Button
                type='secondary'
                htmlType='button'
                size='medium'
                onClick={handleCancel}
              >
                Отменить
              </Button>
              <Button
                disabled={!isFormValid}
                type='primary'
                size='medium'
                htmlType='submit'
              >
                Сохранить
              </Button>
            </div>
          )}
          {updateUserError && (
            <p
              className={`${commonStyles.error} pt-5 text text_type_main-default`}
            >
              {updateUserError}
            </p>
          )}
        </>
      </form>
    </main>
  );
};
