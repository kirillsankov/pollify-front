import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import stype from './global.module.scss';
import PrivateRoute from './components/PrivateRoute';
import RegisterPage from './pages/RegisterPage';
import UnauthRoute from './components/UnauthRoute';
import Application from './pages/Aplication';

function App() {
  return (
    <>
      <Header/>
          <main className={stype.main}>
            <Routes>
              <Route element={<PrivateRoute/>}>
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
