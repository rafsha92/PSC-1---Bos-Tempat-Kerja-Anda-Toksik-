import React, { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const root = document.getElementById('root');
const siteUrl = document.documentElement.dataset.siteUrl || '';
const application = (
  <StrictMode>
    <App siteUrl={siteUrl} />
  </StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, application);
} else {
  createRoot(root).render(application);
}
