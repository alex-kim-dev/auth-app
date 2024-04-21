import { zodResolver } from '@hookform/resolvers/zod';
import cn from 'clsx';
import { useLayoutEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { LoadingButton } from '~/components';
import { useAuth } from '~/contexts/auth';

const schema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z
    .string()
    .min(1, 'Password should be at least 1 character long')
    .regex(/^[a-zA-Z]+$/, 'Password should consist of latin characters'),
});

type LoginInputs = z.infer<typeof schema>;

export const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(schema),
    criteriaMode: 'all',
  });
  const { logIn } = useAuth();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    document.title = 'Auth app | Login';
  });

  const onSubmit: SubmitHandler<LoginInputs> = async ({ email, password }) => {
    if (isSubmitting) return;

    const { error } = await logIn({ email, password });

    if (error) console.error(error);
    else navigate('/users');
  };

  return (
    <main className='container'>
      <div className='row align-items-center min-vh-100'>
        <div className='col'>
          <form
            className='d-flex flex-column align max-w-form m-auto'
            noValidate
            onSubmit={handleSubmit(onSubmit)}>
            <h1 className='align-self-center mb-5'>Log in</h1>
            <div className='mb-4'>
              <label className='visually-hidden' htmlFor='email'>
                email
              </label>
              <input
                className={cn('form-control', {
                  'is-valid': isSubmitted && !errors.email,
                  'is-invalid': errors.email,
                })}
                id='email'
                placeholder='Email'
                type='email'
                {...register('email')}
              />
              <div className='invalid-feedback'>{errors.email?.message}</div>
            </div>
            <div className='mb-4'>
              <label className='visually-hidden' htmlFor='password'>
                password
              </label>
              <input
                className={cn('form-control', {
                  'is-valid': isSubmitted && !errors.password,
                  'is-invalid': errors.password,
                })}
                id='password'
                placeholder='Password'
                type='password'
                {...register('password')}
              />
              <div className='invalid-feedback'>{errors.password?.message}</div>
            </div>
            <LoadingButton
              className='btn btn-primary mb-5'
              loading={isSubmitting}
              loadingContent='Singing in...'
              type='submit'>
              Submit
            </LoadingButton>
            <NavLink className='align-self-center' to='/register'>
              Register a new account
            </NavLink>
          </form>
        </div>
      </div>
    </main>
  );
};
