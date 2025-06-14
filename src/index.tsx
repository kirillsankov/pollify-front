import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { store } from './store/store';
import { BrowserRouter as Router, } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <HelmetProvider>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </HelmetProvider>
);