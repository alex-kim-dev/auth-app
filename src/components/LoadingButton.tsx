import type { ComponentProps, ReactNode } from 'react';

interface LoadingButtonProps extends ComponentProps<'button'> {
  loading: boolean;
  loadingContent?: ReactNode;
  children?: ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  loadingContent,
  children,
  ...props
}) => {
  return (
    <button disabled={loading} type='button' {...props}>
      {loading ? (
        <>
          <span
            aria-hidden='true'
            className='spinner-border spinner-border-sm me-2'
          />
          <span role='status'>{loadingContent || children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
