import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../../components/Auth/index';
import { forgotPassword, resetPassword } from '../../api/authApi';
import { FormField } from '../../components/Auth/AuthForm';
import AuthContainer from './AuthContainer';
import { SuccessMessage } from '../../components/shared/index';
import style from '../../styles/Application/index.module.scss';


enum ResetStep {
  EMAIL = 0,
  CODE = 1,
  PASSWORD = 2,
  SUCCESS = 3
}

const ResetPasswordPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ResetStep>(ResetStep.EMAIL);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>(''); // Stores the value of 'newPassword' field
  const [confirmPassword, setConfirmPassword] = useState<string>(''); // Stores the value of 'confirmPassword' field
  const [resendLoad, setResendLoad] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleEmailSubmit = async (values: any) => {
    try {
      const { email: userEmail } = values;
      setEmail(userEmail);
      
      const response = await forgotPassword(userEmail);
      
      if (response.error) {
        return Array.isArray(response.message) ? response.message[0] : response.message;
      }
      
      setCurrentStep(ResetStep.CODE);
      return null;
    } catch (error) {
      return "An unexpected error occurred. Please try again.";
    }
  };

  const handleCodeSubmit = async (values: any) => {
    try {
      const { code } = values;
      
      setCurrentStep(ResetStep.PASSWORD);
      return null;
    } catch (error) {
      return "An unexpected error occurred. Please try again.";
    }
  };

  const handlePasswordSubmit = async (values: any) => {
    try {
      const { code, newPassword, confirmPassword } = values;

      if (newPassword !== confirmPassword) {
        return "Passwords don't match";
      }
      
      const response = await resetPassword(email, code, newPassword);
      
      if (response.error) {
        return Array.isArray(response.message) ? response.message[0] : response.message;
      }
      
      setCurrentStep(ResetStep.SUCCESS);
      return null;
    } catch (error) {
      return "An unexpected error occurred. Please try again.";
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

  const validateCode = {
    onChange: ({ value }: { value: string }) => {
      if (!value) {
        return 'Verification code is required';
      }
      if (isNaN(+value)) {
        return 'Code must be a number';
      }
      if (value.length !== 6) {
        return 'Code must be 6 digits';
      }
    }
  };

  const validatePassword = {
    onChange: ({ value }: { value: string }) => { // value is from 'newPassword' field
      setPassword(value); // Update state for 'newPassword'
      
      // Standard validations for 'newPassword'
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      if (value.length > 30) return 'Password must be less than 30 characters';
      const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
      if (!passwordRegex.test(value)) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, and one number or special character';
      }
      
      return null; // All good
    }
  };

  const validateConfirmPassword = {
    onChange: ({ value }: { value: string }) => { // value is from 'confirmPassword' field
      setConfirmPassword(value); // Update state for 'confirmPassword'
      
      if (!value) return 'Confirm password is required';
      
      return null; // All good
    }
  };

  const emailFields: FormField[] = [
    {
      name: 'email',
      label: 'Email:',
      type: 'text',
      validators: validateEmail
    }
  ];

  const codeFields: FormField[] = [
    {
      name: 'code',
      label: 'Verification Code:',
      type: 'text',
      validators: validateCode
    }
  ];

  const passwordFields: FormField[] = [
    {
      name: 'code',
      label: 'Verification Code:',
      type: 'text',
      validators: validateCode
    },
    {
      name: 'newPassword',
      label: 'New Password:',
      type: 'password',
      validators: validatePassword
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password:',
      type: 'password',
      validators: validateConfirmPassword
    }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case ResetStep.EMAIL:
        return (
          <AuthForm
            fields={emailFields}
            onSubmit={handleEmailSubmit}
            submitButtonText="Send Reset Link"
            defaultValues={{ email: '' }}
          />
        );
      case ResetStep.CODE:
        return (
          <AuthForm
            fields={codeFields}
            onSubmit={handleCodeSubmit}
            submitButtonText="Verify Code"
            defaultValues={{ code: '' }}
            footerContent={
                <div>
                    <p>Didn't receive a code?</p>
                    <button className={style.link} onClick={async () => {
                        setResendLoad(true);
                        await forgotPassword(email);
                        setResendLoad(false);
                    }}>{resendLoad ? 'Sending...' : 'Resend Code'}</button> 
                </div>
            }
          />
        );
      case ResetStep.PASSWORD:
        return (
          <AuthForm
            fields={passwordFields}
            onSubmit={handlePasswordSubmit}
            submitButtonText="Reset Password"
            defaultValues={{ 
              code: '',
              newPassword: '',
              confirmPassword: ''
            }}
          />
        );
      case ResetStep.SUCCESS:
        return <SuccessMessage 
            onClick={() => {
              navigate('/login');
            }} 
            title='Password Reset Successful' 
            description='Your password has been successfully reset. You can now log in with your new password.' 
            buttonText='Go to Login' 
        />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case ResetStep.EMAIL:
        return "Reset Password";
      case ResetStep.CODE:
        return "Enter Verification Code";
      case ResetStep.PASSWORD:
        return "Create New Password";
      case ResetStep.SUCCESS:
        return "Password Reset";
      default:
        return "Reset Password";
    }
  };

  return (
    <AuthContainer title={getStepTitle()}>
      {renderStepContent()}
    </AuthContainer>
  );
};

export default ResetPasswordPage;