import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import stype from './global.module.scss';
import PrivateRoute from './components/PrivateRoute';
import { Home } from './pages/Home';

function App() {
  return (
    <>
      <Header/>
          <main className={stype.main}>
            <Routes>
              <Route path={"/login"} element={<LoginPage />} />
              <Route element={<PrivateRoute/>}>
                <Route path="/app/*" element={<Home />} />
              </Route>
            </Routes>
          </main>
      <Footer/>
    </>
  );
}

export default App;
