import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import { Header, Footer } from './components/Layout/index';
import style from './styles/app.module.scss';

import { PrivateRoute, UnauthRoute } from './components/Auth/index';
import { RegisterPage } from './pages/Auth/index';
import { Application, WorkingPage } from './pages/Application/index';
import { Home } from './pages/Home/index';
import { AuthProvider } from './contexts/AuthContext';
import { NotFound } from './pages/Error/index';
import ValidateEmailPage from './pages/Auth/ValidateEmailPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';

function App() {
  return (
    <AuthProvider>
      <Header/>
      <main className={style.main}>
        <Routes>
          <Route path="/" element={<Home/>}/> 
          <Route path="/form/:id" element={
            <PrivateRoute>
              <WorkingPage />
            </PrivateRoute>
          } />
          <Route path="/app/*" element={
            <PrivateRoute>
              <Application />
            </PrivateRoute>
          } />
          <Route path="/login" element={
            <UnauthRoute>
              <LoginPage />
            </UnauthRoute>
          } />
          <Route path="/register" element={
            <UnauthRoute>
              <RegisterPage />
            </UnauthRoute>
          } />
          <Route path="/verify" element={
            <UnauthRoute>
              <ValidateEmailPage title='Verify Email' />
            </UnauthRoute>
          } />
          <Route path="/reset-password" element={
            <UnauthRoute>
              <ResetPasswordPage />
            </UnauthRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer/>
    </AuthProvider>
  );
}

export default App;
