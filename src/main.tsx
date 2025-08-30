import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ProductProvider } from './contexts/ProductContext.tsx';

createRoot(document.getElementById("root")!).render(
  <ProductProvider>
    <App />
  </ProductProvider>
);
