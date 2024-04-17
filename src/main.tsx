import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <StrictMode>
    <h1>Auth app</h1>
  </StrictMode>,
);
