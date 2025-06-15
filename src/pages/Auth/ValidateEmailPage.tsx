import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { resendVerifyEmailCode, verifyEmail } from "../../api/authApi";
import { AuthForm } from "../../components/Auth/index";
import AuthContainer from "./AuthContainer";
import { FormField } from "../../components/Auth/AuthForm";
import style from '../../styles/Application/index.module.scss';
import { SuccessMessage } from "../../components/shared/index";

interface Props {
    title: string;
}

enum VerificationStep {
    CODE = 0,
    SUCCESS = 1
}

const ValidateEmailPage= ({title}: Props) => {
    const [email, setEmail] = useState<string | null>(null);
    const [resendLoad, setResendLoad] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<VerificationStep>(VerificationStep.CODE);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const currentEmail = searchParams.get('email');
        if(!currentEmail) {
            navigate('/register');
        }
        setEmail(currentEmail);
    }, [])
    
    const handleSubmit = async (values: any) => {
        const { code } = values;
        if(!email) {
            navigate('/register');
            return 'Email is required';
        }
        const messageData = await verifyEmail(email, code);
    
        if(messageData.error) {
            const errorMessage = Array.isArray(messageData.message) ? messageData.message[0] : messageData.message;
            // if(errorMessage === 'Email already verified') {
            //     navigate('/login');
            //     return errorMessage;
            // }
            // if(errorMessage === 'User with this email does not exist') {
            //     navigate('/register');
            //     return errorMessage;
            // }
            return errorMessage;
        }
        
        setCurrentStep(VerificationStep.SUCCESS);
        return null;
    };    
    
    const validatorsCode = {
    onChange: ({ value }: { value: string }) => {
        if (!value) {
        return 'Code is required';
        }
        if (isNaN(+value)) {
        return 'Code must be a number';
        }
        if (value.length !== 6) {
        return 'Code must be 6 digits';
        }
    }
    };
    
    const fields: FormField[] = [
    {
        name: 'code',
        label: 'Verification Code:',
        type: 'text',
        validators: validatorsCode
    }
    ];
    
    const renderContent = () => {
        switch (currentStep) {
            case VerificationStep.CODE:
                return (
                    <AuthForm
                        fields={fields}
                        onSubmit={handleSubmit}
                        submitButtonText="Verify"
                        defaultValues={{
                            code: ''
                        }}
                        footerContent={
                            <div>
                                <p>Didn't receive a code?</p>
                                <button className={style.link} onClick={async () => {
                                    if(!email) {
                                        navigate('/register');
                                        return 'Email is required';
                                    }
                                    setResendLoad(true);
                                    await resendVerifyEmailCode(email);
                                    setResendLoad(false);
                                }}>{resendLoad ? 'Sending...' : 'Resend Code'}</button> 
                            </div>
                        }
                    />
                );
            case VerificationStep.SUCCESS:
                return (
                    <SuccessMessage 
                        onClick={() => {
                            navigate(`/login${location.search}`);
                        }} 
                        title='Email Verified Successfully' 
                        description='Your email has been successfully verified. You can now log in to your account.' 
                        buttonText='Go to Login' 
                    />
                );
            default:
                return null;
        }
    };
    
    return (
        <>
            <Helmet>
                <title>{currentStep === VerificationStep.SUCCESS ? "Email Verification" : title} - Pollify</title>
                <meta name="description" content="Verify your email address to complete your Pollify account registration" />
            </Helmet>
            <AuthContainer title={currentStep === VerificationStep.SUCCESS ? "Email Verification" : title}>
                {renderContent()}
            </AuthContainer>
        </>
    );
}

export default ValidateEmailPage;