import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import stype from './global.module.scss';

function App() {
  return (
    <>
      <Header/>
          <main className={stype.main}>
            <Routes>
              <Route path={"/login"} element={<LoginPage />} />
            </Routes>
          </main>
      <Footer/>
    </>
  );
}

export default App;
