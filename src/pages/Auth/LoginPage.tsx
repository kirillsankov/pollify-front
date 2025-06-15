import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { login } from '../../store/authSlice';
import { FormField } from '../../components/Auth/AuthForm';
import style from '../../styles/Application/index.module.scss';
import { AuthForm } from '../../components/Auth/index';
import AuthContainer from './AuthContainer';
import { ApiError } from '../../types/inerfaces';

interface Props {
  callBackSuccess?: () => void;
}

const LoginPage: React.FC<Props> = ({ callBackSuccess }) => {
  const [, setForgotPassword] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (values: {email: string, password: string}) => {
    const { email, password } = values;
    try {
      (await dispatch(login({ email, password })).unwrap()) ;
      
      const queryParams = new URLSearchParams(location.search);
      const redirectTo = queryParams.get('redirect_to');

      if (callBackSuccess) {
        callBackSuccess();
      } else if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate('/app/stats');
      }
      return null;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError) {
          if (apiError.message && (apiError.message.includes('not verified') || apiError.message.includes('Email not verified') || apiError.message.includes('Please verify your email'))) {
            const queryParams = new URLSearchParams();
            queryParams.set('email', email);
            navigate(`/verify?${queryParams.toString()}`);
            return null;
          }
          return apiError.message;
      } else {
          return 'An unknown error occurred';
      }
    }
  };

  const validateEmail = {
    onChange: ({ value }: { value: string }) => {
      if (!value) {
        return 'Email is required';
      }
      
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
  };

  const validatePassword = {
    onChange: ({ value }: { value: string }) => {
      if (!value) {
        return 'Password is required';
      }
    }
  };

  const fields: FormField[] = [
    {
      name: 'email',
      label: 'Email :',
      type: 'text',
      validators: validateEmail
    },
    {
      name: 'password',
      label: 'Password:',
      type: 'password',
      validators: validatePassword
    }
  ];

  const footerContent = (
    <div className={style.form__registerLink}>
      <div>Don't have an account? <Link className={style.link} to={`/register${location.search}`}>Register here</Link></div>
      <div><Link className={style.link} to={`/reset-password${location.search}`}>Forgot password?</Link></div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Login - Pollify</title>
        <meta name="description" content="Login to your Pollify account to create and manage polls" />
      </Helmet>
      <AuthContainer title="Login">
        <AuthForm
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Login"
        defaultValues={{
          username: '',
          password: ''
        }} 
        footerContent={footerContent}
      />
      </AuthContainer>
    </>
  );
};

export default LoginPage;