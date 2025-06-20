import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Apply security measures for the whole app
const enhanceDocumentSecurity = () => {
  // Disable browser features that could be exploited
  if (document.body) {
    // Prevent drag & drop file execution
    document.body.addEventListener('dragover', (e) => e.preventDefault());
    document.body.addEventListener('drop', (e) => e.preventDefault());
  }
  
  // Set document's referrer policy
  const metaReferrer = document.createElement('meta');
  metaReferrer.name = 'referrer';
  metaReferrer.content = 'strict-origin-when-cross-origin';
  document.head.appendChild(metaReferrer);
  
  // Add X-Content-Type-Options through meta tag as fallback
  const metaContentType = document.createElement('meta');
  metaContentType.httpEquiv = 'X-Content-Type-Options';
  metaContentType.content = 'nosniff';
  document.head.appendChild(metaContentType);
};

// Apply security enhancements before rendering
enhanceDocumentSecurity();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);