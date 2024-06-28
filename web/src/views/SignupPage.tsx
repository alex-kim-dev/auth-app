import { zodResolver } from '@hookform/resolvers/zod';
import { useLayoutEffect } from 'react';
import { SubmitHandler, useForm, type ValidateResult } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import cn from 'clsx';
import { toast } from 'react-toastify';
import { PasswordField } from '~/components';
import { api } from '~/api';
import { useGlobalState } from '~/store';
import { isAxiosError } from 'axios';

const schema = z
  .object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z
      .string()
      .min(8)
      .max(15)
      .regex(/^[a-zA-Z\d!@#$%^&*]+$/, 'hasAllowedSymbols')
      .regex(/[a-z]/, 'hasLowercase')
      .regex(/[A-Z]/, 'hasUppercase')
      .regex(/\d/, 'has1Number')
      .regex(/[!@#$%^&*]/, 'has1SpecialChar'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
  });

type RegisterInputs = z.infer<typeof schema>;

/** check error in validation result */
const check = (result: ValidateResult | undefined, message: string) => {
  if (result === undefined || typeof result === 'boolean') return false;
  if (typeof result === 'string') return result === message;
  return result.includes(message);
};

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useGlobalState();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitting },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(schema),
    criteriaMode: 'all',
  });

  useLayoutEffect(() => {
    document.title = 'Auth app | Sign up';
  });

  const onSubmit: SubmitHandler<RegisterInputs> = async ({
    email,
    name,
    password,
  }) => {
    try {
      const { data } = await api.auth.signup({ email, name, password });

      setAuth(data);
      navigate('/users');
    } catch (error) {
      if (isAxiosError<{ message: string }>(error))
        toast.error(
          error.response?.data.message ?? 'Unexpected error, try again later',
        );
    }
  };

  const pwErrTypes = errors.password?.types;
  const pwValidationResult = pwErrTypes?.invalid_string;
  const pwHasAllowedLength = !(pwErrTypes?.too_small || pwErrTypes?.too_big);
  const pwHasLowercase = !check(pwValidationResult, 'hasLowercase');
  const pwHasUppercase = !check(pwValidationResult, 'hasUppercase');
  const pwHas1Number = !check(pwValidationResult, 'has1Number');
  const pwHas1SpecialChar = !check(pwValidationResult, 'has1SpecialChar');

  const getStatusCN = (requirement: boolean) =>
    cn({
      success: isSubmitted && requirement,
      danger: isSubmitted && !requirement,
    });

  return (
    <>
      <button
        className='btn-back content__back'
        type='button'
        onClick={() => {
          navigate(-1);
        }}>
        Back
      </button>
      <form className='auth-form' noValidate onSubmit={handleSubmit(onSubmit)}>
        <h2 className='auth-form__heading text-center'>Create an account</h2>
        <div className='auth-form__fields'>
          <label className='hidden' htmlFor='email'>
            Email address
          </label>
          <input
            id='email'
            {...register('email')}
            className={cn('input', { danger: errors.email })}
            placeholder='Enter your email'
            type='email'
          />

          <label className='hidden' htmlFor='name'>
            Name
          </label>
          <input
            className={cn('input', { danger: errors.name })}
            id='name'
            {...register('name')}
            placeholder='Enter your name'
            type='text'
          />

          <div>
            <label className='hidden' htmlFor='password'>
              Password
            </label>
            <PasswordField
              className={cn('input', { danger: errors.password })}
              id='password'
              {...register('password')}
              placeholder='Create a password'
              type='password'
            />
            <ul className='auth-form__requirements'>
              <li
                className={cn(
                  'auth-form__requirement',
                  getStatusCN(pwHasAllowedLength),
                )}>
                8 to 15 characters
              </li>
              <li
                className={cn(
                  'auth-form__requirement',
                  getStatusCN(pwHasLowercase && pwHasUppercase),
                )}>
                Lowercase and uppercase letters
              </li>
              <li
                className={cn(
                  'auth-form__requirement',
                  getStatusCN(pwHas1Number),
                )}>
                At least 1 number
              </li>
              <li
                className={cn(
                  'auth-form__requirement',
                  getStatusCN(pwHas1SpecialChar),
                )}>
                At least 1 special character: !@#$%^&*
              </li>
            </ul>
          </div>

          <label className='hidden' htmlFor='password2'>
            Repeat the password
          </label>
          <PasswordField
            className={cn('input', { danger: errors.passwordConfirm })}
            id='password2'
            {...register('passwordConfirm')}
            placeholder='Repeat the password'
            type='password'
          />
          <button
            className={cn('btn', { 'btn--loading': isSubmitting })}
            disabled={isSubmitting}
            type='submit'>
            Sign up
          </button>
        </div>
      </form>
    </>
  );
};
