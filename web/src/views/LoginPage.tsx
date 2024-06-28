import { useLayoutEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import cn from 'clsx';
import { toast } from 'react-toastify';
import { PasswordField } from '~/components';
import { useGlobalState } from '~/store';
import { api } from '~/api';
import { isAxiosError } from 'axios';

interface LoginInputs {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useGlobalState();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginInputs>();

  useLayoutEffect(() => {
    document.title = 'Auth app | Login';
  });

  const onSubmit: SubmitHandler<LoginInputs> = async ({ email, password }) => {
    if (email.length === 0 || password.length === 0) return;

    try {
      const { data } = await api.auth.login({ email, password });

      setAuth(data);
      navigate('/users');
    } catch (error) {
      if (isAxiosError<{ message: string }>(error))
        toast.error(
          error.response?.data.message ?? 'Unexpected error, try again later',
        );
    }
  };

  return (
    <form
      className='auth-form text-center'
      onSubmit={handleSubmit(onSubmit)}
      noValidate>
      <h2 className='auth-form__heading'>Welcome back!</h2>
      <div className='auth-form__fields'>
        <label className='hidden' htmlFor='email'>
          Your email
        </label>
        <input
          className='input'
          id='email'
          placeholder='Enter your email'
          type='email'
          {...register('email')}
        />
        <label className='hidden' htmlFor='password'>
          Your password
        </label>
        <PasswordField
          className='input'
          id='password'
          placeholder='Enter your password'
          {...register('password')}
        />
      </div>
      <button
        className={cn('btn', { 'btn--loading': isSubmitting })}
        disabled={isSubmitting}
        type='submit'>
        Login
      </button>
      <div className='auth-form__link'>
        <NavLink to='/signup'>I don't have an account yet</NavLink>
      </div>
    </form>
  );
};
