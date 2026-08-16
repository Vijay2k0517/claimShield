import React from 'react';
import ReactDOM from 'react-dom/client';
import './design-system/tokens/tokens.css';
import './design-system/tokens/reset.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
