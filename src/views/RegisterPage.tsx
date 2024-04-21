import { zodResolver } from '@hookform/resolvers/zod';
import cn from 'clsx';
import { useLayoutEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { LoadingButton } from '~/components';
import { useAuth } from '~/contexts/auth';

const schema = z
  .object({
    email: z.string().email('Please provide a valid email'),
    name: z
      .string()
      .min(1, 'Name should be at least 1 character long')
      .regex(/^[a-zA-Z]+$/, 'Name should consist of latin characters'),
    password: z
      .string()
      .min(6, 'Password should be at least 6 character long')
      .regex(/^[a-zA-Z]+$/, 'Password should consist of latin characters'),
    passwordConfirm: z
      .string()
      .min(6, 'Password should be at least 6 character long'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords should match',
  });

type RegisterInputs = z.infer<typeof schema>;

export const RegisterPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(schema),
    criteriaMode: 'all',
  });
  const [registerError, setRegisterError] = useState<Error | null>(null);
  const { register: signUp } = useAuth();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    document.title = 'Auth app | Register';
  });

  const onSubmit: SubmitHandler<RegisterInputs> = async ({
    email,
    password,
    name,
  }) => {
    if (isSubmitting) return;
    setRegisterError(null);

    const { error } = await signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) setRegisterError(error);
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
            <h1 className='align-self-center mb-5'>Register</h1>
            <div className='mb-4'>
              <label className='visually-hidden' htmlFor='email'>
                email
              </label>
              <input
                aria-describedby='emailHelp'
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
              <div className='form-text' id='emailHelp'>
                This app doesn&apos;t verify emails, you can use any
              </div>
            </div>
            <div className='mb-4'>
              <label className='visually-hidden' htmlFor='name'>
                name
              </label>
              <input
                className={cn('form-control', {
                  'is-valid': isSubmitted && !errors.name,
                  'is-invalid': errors.name,
                })}
                id='name'
                placeholder='Name'
                type='text'
                {...register('name')}
              />
              <div className='invalid-feedback'>{errors.name?.message}</div>
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
            <div className='mb-4'>
              <label className='visually-hidden' htmlFor='password2'>
                password confirmation
              </label>
              <input
                className={cn('form-control', {
                  'is-valid': isSubmitted && !errors.passwordConfirm,
                  'is-invalid': errors.passwordConfirm,
                })}
                id='password2'
                placeholder='Confirm password'
                type='password'
                {...register('passwordConfirm')}
              />
              <div className='invalid-feedback'>
                {errors.passwordConfirm?.message}
              </div>
            </div>
            <LoadingButton
              className='btn btn-primary mb-3'
              loading={isSubmitting}
              loadingContent='Registering...'
              type='submit'>
              Submit
            </LoadingButton>
            {registerError && (
              <div className='text-danger text-center'>
                {registerError.message}
              </div>
            )}
            <NavLink className='align-self-center mt-5' to='/'>
              Log in
            </NavLink>
          </form>
        </div>
      </div>
    </main>
  );
};
