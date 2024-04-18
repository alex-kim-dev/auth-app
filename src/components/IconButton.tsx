import cn from 'clsx';
import type { ComponentProps, ReactNode } from 'react';
import { type Icon } from 'react-bootstrap-icons';

interface IconButtonProps extends ComponentProps<'button'> {
  icon: Icon;
  side?: 'start' | 'end';
  children?: ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  side = 'start',
  children,
  className,
  ...props
}) => {
  const icon = <Icon height={20} width={20} aria-hidden />;

  return (
    <button
      className={cn('d-flex gap-1 align-items-center', className)}
      type='button'
      {...props}>
      {side === 'start' && icon}
      {children}
      {side === 'end' && icon}
    </button>
  );
};
