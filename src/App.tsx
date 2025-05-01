import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import { Header, Footer } from './components/Layout/index';
import style from './styles/app.module.scss';

import { PrivateRoute, UnauthRoute } from './components/Auth/index';
import { RegisterPage } from './pages/Auth/index';
import { Application, WorkingPage } from './pages/Application/index';
import { Home } from './pages/Home/index';
import { useRef } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import NotFound from './pages/Error/NotFound';

function App() {
  const refMain = useRef(null);
  return (
    <>
      <Header/>
      <main ref={refMain} className={style.main}>
        <Routes>
          <Route path="/" element={<Home/>} errorElement={<div>Error</div>} /> 
          <Route path="/form/:id|/app/*|/login|/register" element={
            <AuthProvider>
              <Routes>
                <Route element={<PrivateRoute/>}>
                  <Route path="form/:id" element={<WorkingPage />} /> 
                  <Route path="app/*" element={<Application />} />
                </Route>
                <Route element={<UnauthRoute/>}>
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                </Route>
              </Routes>
            </AuthProvider>
          } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer/>
    </>
  );
}

export default App;
