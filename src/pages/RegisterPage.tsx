import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { AppDispatch, RootState } from '../store/store';
import style from '../assets/styles/Form.module.scss'

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { status, error } = useSelector((state: RootState) => state.auth);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(login({ username, password })).then(() => {
        navigate('/app');
      });
    };

  return (
    <div className={`${style.container} ${style.form__container}`}>
      <div className={style.form__block}>
          <h1 className={style.form__title}>Register</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form className={style.form__wrapper} onSubmit={handleSubmit}>
            <div className={style.form__item}>
              <input
                className={style.form__input}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=' '
                required
              />
              <label className={style.form__label}>Username:</label>
            </div>
            <div className={style.form__item}>
              <input
                className={style.form__input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=' '
                required
              />
              <label className={style.form__label}>Password:</label>
            </div>
            <div className={style.form__item}>
              <input
                className={style.form__input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=' '
                required
              />
              <label className={style.form__label}>Password:</label>
            </div>
            <button className={style.form__sumbit} type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Loading...' : 'Submit'}
            </button>
          </form>
      </div>
    </div>
  );
};

export default RegisterPage;