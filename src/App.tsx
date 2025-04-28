import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import { Header, Footer } from './components/Layout/index';
import style from './styles/app.module.scss';

import { PrivateRoute, UnauthRoute } from './components/Auth/index';
import { RegisterPage } from './pages/Auth/index';
import { Application, WorkingPage } from './pages/Application/index';
import { Home } from './pages/Home/index';
import { useRef } from 'react';

function App() {
  const refMain = useRef(null);
  return (
    <>
      <Header/>
          <main ref={refMain} className={style.main}>
            <Routes>
              <Route path="/" element={<Home mainRef={refMain} />} /> 
              <Route element={<PrivateRoute/>}>
                <Route path="/form/:id" element={<WorkingPage />} /> 
                <Route path="/app/*" element={<Application />} />
              </Route>
              <Route element={<UnauthRoute/>}>
                <Route path={"/login"} element={<LoginPage />} />
                <Route path={"/register"} element={<RegisterPage />} />
              </Route>
            </Routes>
          </main>
      <Footer/>
    </>
  );
}

export default App;
