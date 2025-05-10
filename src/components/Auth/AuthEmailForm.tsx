import { verifyEmail } from '../../api/authApi';
import { FormField } from './AuthForm';
import { AuthForm } from './index';

interface Props {
  email: string;
  successFn: () => void;
}

export const AuthEmailFormContainer = ({ email, successFn }: Props) => {
  const handleSubmit = async (values: any) => {
    const { code } = values;
    const messageData = await verifyEmail(email, code);

    if(messageData.error) {
      return messageData.message;
    }

    successFn();
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

  return (
    <AuthForm
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Verify"
      defaultValues={{
        code: ''
      }}
    />
  );
};