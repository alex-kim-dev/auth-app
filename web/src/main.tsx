import 'react-toastify/dist/ReactToastify.css';
import '~/styles/reset.css';
import '@fontsource/m-plus-1p/400.css';
import '@fontsource/m-plus-1p/500.css';
import '~/styles/main.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '~/App';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
