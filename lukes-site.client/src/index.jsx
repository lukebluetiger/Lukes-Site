import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SignalRProvider } from './context/SignalRContext.jsx'; // Ensure correct path
import reportWebVitals from './reportWebVitals';
import './styles/style.css'; // import global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <SignalRProvider>
   <App />
   </SignalRProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
