import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { AppDispatch } from '../store/store';
import style from '../assets/styles/Form.module.scss'
import { useForm } from '@tanstack/react-form'
import { FieldInfo } from '../components/UI/FieldInfo';

interface Props {
  callBackSuccess?: () => void | undefined;
}

const LoginPage = ({ callBackSuccess }: Props) => {
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
            const result = await dispatch(login({ username, password }));
            
            if (result && result.meta.requestStatus === 'rejected') {
              const rejectedResult = result as { error: { message?: string } };
              console.log('Login error:', rejectedResult.error);
              
              if (rejectedResult.error?.message?.includes('401')) {
                return 'Password or username is incorrect';
              }
              return rejectedResult.error?.message || 'Server error';
            }
            if (callBackSuccess) {
              callBackSuccess();
            } else {
              navigate('/app/stats');
            }
            return null;
          } catch (error) {
            console.log('Unexpected error:', error);
            return 'An unexpected error occurred';
          }
        },
      },
  })


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
                  <span className={style.form__mainError}>{typeof errorMap === 'object' && 'onSubmit' in errorMap ? errorMap.onSubmit : null}</span>

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