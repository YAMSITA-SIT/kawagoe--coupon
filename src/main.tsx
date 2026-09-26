import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { StoreAdminApp } from './store-app/StoreAdminApp.tsx';
import './index.css';

const pathname = window.location.pathname.toLowerCase();
const isAdminRoute = ['/admin', '/store-app', '/store-admin'].some((route) =>
  pathname === route || pathname.startsWith(`${route}/`),
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminRoute ? <StoreAdminApp /> : <App />}
  </StrictMode>,
);
