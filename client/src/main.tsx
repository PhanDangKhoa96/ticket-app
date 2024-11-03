import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles.css';

import App from './app/app';
import { TicketProvider } from './app/components/TicketProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <TicketProvider>
      <App />
    </TicketProvider>
  </BrowserRouter>
);
