import { zodResolver } from '@hookform/resolvers/zod';
import cn from 'clsx';
import { useLayoutEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { z } from 'zod';

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

  useLayoutEffect(() => {
    document.title = 'Auth app | Login';
  });

  const onSubmit: SubmitHandler<LoginInputs> = async ({ email, password }) => {
    if (isSubmitting) return;
    // if (email.length === 0 || password.length === 0) return;

    console.info(`Triggered onSubmit with: ${{ email, password }}`);

    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 1500);
    });
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
            <button
              className='btn btn-primary mb-5'
              disabled={isSubmitting}
              type='submit'>
              {isSubmitting ? (
                <>
                  <span
                    aria-hidden='true'
                    className='spinner-border spinner-border-sm me-2'
                  />
                  <span role='status'>Loading...</span>
                </>
              ) : (
                'Submit'
              )}
            </button>
            <NavLink className='align-self-center' to='/register'>
              Register a new account
            </NavLink>
          </form>
        </div>
      </div>
    </main>
  );
};
