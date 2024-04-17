import { App } from '~/App';
import { render, screen, user } from '~/testUtils';

test('counter increments correctly', async () => {
  render(<App />);
  const button = screen.getByRole('button', { name: /count is: 0/ });
  user.click(button);
  const updatedBtn = await screen.findByRole('button', { name: /count is: 1/ });
  expect(updatedBtn).toBeInTheDocument();
});
