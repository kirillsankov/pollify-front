import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  const handleSubmit = async (values: {email: string, password: string}) => {
    const { email, password } = values;
    try {
      (await dispatch(login({ email, password })).unwrap()) ;
      
      if (callBackSuccess) {
        callBackSuccess();
      } else {
        navigate('/app/stats');
      }
      return null;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError) {
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
      <div>Don't have an account? <Link className={style.link} to="/register">Register here</Link></div>
      <div><Link className={style.link} to="/reset-password">Forgot password?</Link></div>
    </div>
  );

  return (
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
  );
};

export default LoginPage;