import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi';
import AuthContainer from './AuthContainer';
import { FormField } from '../../components/Auth/AuthForm';
import { AuthForm } from '../../components/Auth/index';


const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (values: any) => {
    const { email, passwordOne: password } = values;
    const registerResponse = await register({ email, password });
    if(registerResponse.error) {
      return Array.isArray(registerResponse.message) ? registerResponse.message[0] : registerResponse.message;
    }
    navigate(`/verify?email=${encodeURIComponent(email)}`);
    return null;
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

  const validatorsPasswordOne = {
    onChange: ({ value }: { value: string }) => {
      setPassword(value);
      if (!value) {
        return 'Password is required';
      }
      if (value.length < 8) {
        return 'Password must be at least 8 characters';
      }
      if (value.length > 30) {
        return 'Password must be less than 30 characters';
      }
      
      const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
      if (!passwordRegex.test(value)) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, and one number or special character';
      }
    }
  };

  const validatorsPasswordTwo = {
    onChange: ({ value }: { value: string }) => {
      if (!value) {
        return 'Confirm password is required';
      }
      if (password !== value) {
        return 'Passwords don\'t match';
      }
    }
  };

  const fields: FormField[] = [
    {
      name: 'email',
      label: 'Email:',
      type: 'text',
      validators: validateEmail
    },
    {
      name: 'passwordOne',
      label: 'Password:',
      type: 'password',
      validators: validatorsPasswordOne
    },
    {
      name: 'passwordTwo',
      label: 'Confirm password:',
      type: 'password',
      validators: validatorsPasswordTwo
    }
  ];

  return (
    <AuthContainer title="Register">
      <AuthForm
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Submit"
        defaultValues={{
          username: '',
          passwordOne: '',
          passwordTwo: ''
        }}
      />
    </AuthContainer>
  );
};

export default RegisterPage;