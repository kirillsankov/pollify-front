import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@tanstack/react-form'

import style from '../assets/styles/Form.module.scss'
import { FieldInfo } from '../components/UI/FieldInfo';
import { register } from '../api/authApi';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = React.useState<string>('');

    const form = useForm({
        defaultValues: {
            username: '',
            passwordOne: '',
            passwordTwo: '',
        },
        validators: {
          onSubmitAsync: async ({value}) => {
            try {
              const { username, passwordOne: password } = value;
              await register({username, password});
              navigate('/login');
              return "";
            } catch (e) {
              return "Error, please try again later";
            }
          } 
        }
    });

  const validatorsUsername = {
    onChange: ({ value }: { value: string }) => {
      if (!value) {
        return 'Password is required';
      }
    }
  }

  const validatorsPasswordOne = {
    onChange: ({ value }: { value: string }) => {
      setPassword(value);
      if (!value) {
        return 'Password is required';
      }
      if (value.length < 6) {
        return 'Password must be at least 6 characters';
      }
      if (!/[A-Z]/.test(value)) {
        return 'Password must contain at least one uppercase letter';
      }
      if (!/[a-z]/.test(value)) {
        return 'Password must contain at least one lowercase letter';
      }
      if (!/[0-9]/.test(value)) {
        return 'Password must contain at least one number';
      }
    }
  }

  const validatorsPasswordTwo = {
    onChange: ({ value }: { value: string }) => {
      if (!value) {
        return 'Confirm password is required';
      }
      if(password !== value) {
        return 'Passwords don\'t match';
      }
    }
  }
  return (
    <div className={`${style.container} ${style.form__container}`}>
      <div className={style.form__block}>
          <h1 className={style.form__title}>Register</h1>
          <form 
            className={style.form__wrapper}
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <form.Field
              name = 'username'
              validators={validatorsUsername}
              children = {(field) => {
                return (
                  <div className={style.form__item}>
                    <input
                      id={field.name}
                      name={field.name}
                      className={style.form__input}
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder=' '
                    />
                    <label className={style.form__label}>Username:</label>
                    <FieldInfo field={field} />
                  </div> 
                  )
                } 
              }
            />
            <form.Field
              name = 'passwordOne'
              validators={validatorsPasswordOne}
              children = {(field) => {
                return (
                  <div className={style.form__item}>
                    <input
                      id={field.name}
                      name={field.name}
                      className={style.form__input}
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder=' '
                    />
                    <label className={style.form__label}>Password:</label>
                    <FieldInfo field={field} />
                  </div> 
                  )
                } 
              }
            />
            <form.Field
              name = 'passwordTwo'
              validators={validatorsPasswordTwo}
              children = {(field) => {
                return (
                  <div className={style.form__item}>
                    <input
                      id={field.name}
                      name={field.name}
                      className={style.form__input}
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder=' '
                    />
                    <label className={style.form__label}>Confirm password:</label>
                    <FieldInfo field={field} />
                  </div> 
                  )
                } 
              }
            />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting, state.errorMap]}
              children={([canSubmit, isSubmitting, errorMap]) => (
                <>
                  <button className={style.form__sumbit} type="submit" disabled={!canSubmit}>
                    {isSubmitting ? 'Loading...' : 'Submit'}
                  </button>
                  <span className={style.form__mainError}>{typeof errorMap === 'object' && 'onSubmit' in errorMap ? errorMap.onSubmit : null}</span>
                </>
              )}
            />
          </form>
      </div>
    </div>
  );
};

export default RegisterPage;