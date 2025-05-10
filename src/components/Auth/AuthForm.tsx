import React from 'react';
import { useForm } from '@tanstack/react-form';
import { FieldInfo } from '../shared/index';
import style from '../../styles/Application/index.module.scss';

export interface FormField {
  name: string;
  label: string;
  type: string;
  validators: any;
  placeholder?: string;
}

interface AuthFormProps {
  fields: FormField[];
  onSubmit: (values: any) => Promise<string | string[] | null>;
  submitButtonText: string;
  defaultValues: Record<string, string>;
  footerContent?: React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({ 
  fields, 
  onSubmit, 
  submitButtonText, 
  defaultValues,
  footerContent 
}) => {
  const form = useForm({
    defaultValues,
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          const result = await onSubmit(value);
          return result || "";
        } catch (e) {
          return "Error, please try again later";
        }
      }
    }
  });

  return (
    <form 
      className={style.form__wrapper}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {fields.map((field) => (
        <form.Field
          key={field.name}
          name={field.name}
          validators={field.validators}
          children={(formField) => (
            <div className={style.form__item}>
              <input
                id={formField.name}
                name={formField.name}
                className={style.form__input}
                type={field.type}
                value={formField.state.value}
                onChange={(e) => formField.handleChange(e.target.value)}
                placeholder=' '
              />
              <label className={style.form__label}>{field.label}</label>
              <FieldInfo field={formField} />
            </div>
          )}
        />
      ))}
      
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting, state.errorMap]}
        children={([canSubmit, isSubmitting, errorMap]) => (
          <>
            <button className={style.form__sumbit} type="submit" disabled={!canSubmit}>
              {isSubmitting ? 'Loading...' : submitButtonText}
            </button>
            <span className={style.form__mainError}>
              {typeof errorMap === 'object' && 'onSubmit' in errorMap ? errorMap.onSubmit : null}
            </span>
          </>
        )}
      />
      
      {footerContent && (
        <div className={style.form__footer}>
          {footerContent}
        </div>
      )}
    </form>
  );
};

export default AuthForm;