import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import stype from './global.module.scss';
import PrivateRoute from './components/PrivateRoute';
import RegisterPage from './pages/RegisterPage';
import UnauthRoute from './components/UnauthRoute';
import Application from './pages/Aplication';
import WorkingPage from './pages/WorkingPage';
import { Home } from './pages/Home';
import { createContext , useRef } from 'react';

function App() {
  const refMain = useRef(null);
  return (
    <>
      <Header/>
          <main ref={refMain} className={stype.main}>
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
