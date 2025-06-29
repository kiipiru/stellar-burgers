import { useEffect, useState } from 'react';

// Хук мимикрует поведение passwordInput для всех остальных видов инпутов

const PWD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{6,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const NAME_REGEX = /^[a-zA-Zа-яА-Я0-9]{4,}$/;

// Допускаем пустые значения форм, чтобы не бесить пользователя ошибками
// если он случайно кликнул на форму
const formValidators = {
  email: {
    validator: (value: string) => value === '' || EMAIL_REGEX.test(value),
    message: 'Укажите корректный email.'
  },
  password: {
    validator: (value: string) => value === '' || PWD_REGEX.test(value),
    message: 'Укажите пароль посложнее.'
  },
  name: {
    validator: (value: string) => value === '' || NAME_REGEX.test(value),
    message: 'Имя должно содержать минимум 4 символа.'
  },
  token: {
    validator: (value: string) => value.trim() !== '',
    message: 'Код обязателен для ввода.'
  }
};

export type FormValues = {
  email?: string;
  password?: string;
  name?: string;
  token?: string;
};

type FormErrors = {
  email?: string;
  password?: string;
  name?: string;
  token?: string;
};

type FormValid = {
  email?: boolean;
  password?: boolean;
  name?: boolean;
  token?: boolean;
};

export type Touched = {
  email?: boolean;
  password?: boolean;
  name?: boolean;
  token?: boolean;
};

export type Focused = {
  email?: boolean;
  password?: boolean;
  name?: boolean;
  token?: boolean;
};

export function useFormValidation(
  values: FormValues,
  touched: Touched,
  focused: Focused,
  options?: { passwordNotRequired?: boolean }
) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isValid, setIsValid] = useState<FormValid>({});

  useEffect(() => {
    const newErrors: FormErrors = {};
    const newValid: FormValid = {};

    (Object.keys(values) as (keyof FormValues)[]).forEach((key) => {
      const validatorConfig = formValidators[key];
      if (validatorConfig) {
        const { validator, message } = validatorConfig;
        const value = values[key] || '';

        let isFieldValid: boolean;
        if (key === 'password' && options?.passwordNotRequired) {
          isFieldValid = value === '' || validator(value);
        } else {
          isFieldValid = focused[key] ? true : validator(value);
        }

        newValid[key] = isFieldValid;

        if (!isFieldValid && touched[key]) {
          newErrors[key] = message;
        }
      }
    });

    setErrors(newErrors);
    setIsValid(newValid);
  }, [values, touched, focused, options?.passwordNotRequired]);

  const isFormValid = Object.entries(values).every(([key, value]) => {
    if (key === 'password' && options?.passwordNotRequired) {
      return isValid[key as keyof FormValid] === true;
    }
    return value?.trim() && isValid[key as keyof FormValid] === true;
  });

  return { errors, isValid, isFormValid };
}
