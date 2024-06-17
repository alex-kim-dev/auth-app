import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import cn from 'clsx';
import EyeCrossedIcon from '~/assets/eye_crossed_icon.svg?react';
import EyeIcon from '~/assets/eye_icon.svg?react';

export const PasswordField = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [isHidden, setHidden] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  useImperativeHandle(ref, () => inputRef.current!);

  const handleHideClick = () => {
    setHidden(!isHidden);
    inputRef.current?.focus();
  };

  return (
    <span className='password'>
      <input
        className={cn('password__input', className)}
        {...props}
        ref={inputRef}
        type={isHidden ? 'password' : 'text'}
      />
      <button
        aria-label='toggle password visibility'
        className='btn btn--alt password__btn'
        type='button'
        onClick={handleHideClick}>
        {isHidden ? <EyeIcon /> : <EyeCrossedIcon />}
      </button>
    </span>
  );
});
