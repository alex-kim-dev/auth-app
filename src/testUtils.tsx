import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FC, ReactElement } from 'react';

const Wrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: Wrapper, ...options });

const user = userEvent.setup();

export * from '@testing-library/react';
export { customRender as render, user };
