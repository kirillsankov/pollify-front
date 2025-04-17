import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { AppDispatch } from '../store/store';
import style from '../assets/styles/Form.module.scss'
import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'
import { AxiosError } from 'axios';

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const formTan = useForm({
      defaultValues: {
        username: '',
        password: '',
      },
      validators: {
      onSubmitAsync: async ({ value }) => {
        const { username, password } = value;
        try {
          await dispatch(login({ username, password })).unwrap();
          navigate('/app');
          console.log('test');
          return null

        } catch (error: AxiosError | unknown) {
          console.log(error);
          if(error instanceof AxiosError) {
            if(error.status === 401 && error.message === 'Invalid credentials') {
              return 'Password or username is incorrect'
            }
          }
          return 'Server error'
        }
      },
    },
    onSubmit: async ({ value }) => {
      const { username, password } = value;
      dispatch(login({ username, password })).then(() => {
        navigate('/app');
      });
    },
  })

    function FieldInfo({ field }: { field: AnyFieldApi }) {
      return (
        <span className={style.form__error}>
          <em>{field.state.meta.errors.join(',')}</em>
        </span>
      )
    }

    const onEventsValidate = ({ value }: { value: string }) => {
      return !value ? 'A username name is required' : value.length < 3 ? 'Username must be at least 3 characters' : undefined;
    }
    const validateUsername = {
      onChange: onEventsValidate,
    }
    const validatePassword = {
      onChange: ({ value }: { value: string }) => {
        if (!value) {
          return 'Password is required';
        }
        // if (value.length < 6) {
        //   return 'Password must be at least 6 characters';
        // }
        // if (!/[A-Z]/.test(value)) {
        //   return 'Password must contain at least one uppercase letter';
        // }
        // if (!/[0-9]/.test(value)) {
        //   return 'Password must contain at least one number';
        // }
        // if (!/[a-z]/.test(value)) {
        //   return 'Password must contain at least one lowercase letter';
        // }
        // return undefined;
      },
    }

  return (
    <div className={`${style.container} ${style.form__container}`}>
      <div className={style.form__block}>
          <h1 className={style.form__title}>Login</h1>
          <form 
            className={style.form__wrapper}
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              formTan.handleSubmit()
            }}
          >
            <>
              <formTan.Field
                name="username"
                validators={validateUsername}
                children={(field) => {
                  return (
                    <>
                      <div className={style.form__item}>
                        <input
                          id={field.name}
                          name={field.name}
                          className={`${style.form__input} ${field.state.meta.errors.length ? style.form__inputError : ''}`}
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder=' '
                        />
                        <label htmlFor={field.name} className={style.form__label}>Username:</label>
                        <FieldInfo field={field} />
                      </div>
                    </>
                    
                  )
                }}
              />
              <formTan.Field
                name="password"
                validators={validatePassword}
                children={(field) => (
                  <>
                    <div className={style.form__item}>
                      <input
                        id={field.name}
                        name={field.name}
                        className={`${style.form__input} ${field.state.meta.errors.length ? style.form__inputError : ''}`}
                        type="password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder=' '
                      />
                      <label className={style.form__label}>Password:</label>
                      <FieldInfo field={field} />
                    </div>
                  </>
              )}
              />
            <formTan.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting, state.errorMap]}
              children={([canSubmit, isSubmitting, errorMap]) => (
                <>
                  <button className={style.form__sumbit} type="submit" disabled={!canSubmit}>
                    {isSubmitting ? 'Loading...' : 'Submit'}
                  </button>
                  <span>{typeof errorMap === 'object' && 'onSubmit' in errorMap ? errorMap.onSubmit : null}</span>

                  <p className={style.form__text}>No account? <Link className={style.link} to="/register">To create...</Link></p>
                </>
              )}
            />
            </>
          </form>
      </div>
    </div>
  );
};

export default LoginPage;