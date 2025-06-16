import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import { useAuth } from '../../hooks/useAuth';
import { createPoll, getForm, updatePoll } from '../../api/formsAPI';
import { ApiError, Poll } from '../../types/inerfaces';
import { FieldInfo, ButtonWithIcon, Loader } from '../shared/index';
import GenerateForm from './GenerateForm';
import style from '../../styles/Application/index.module.scss';

const CreateForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const popupState = useState<boolean>(false);

    const form = useForm({
        defaultValues: {
            title: '',
            questions: [{ text: '', options: [''] }]
        },
        validators: {
            onSubmitAsync: async ({ value }) => {
                try {
                    if (!token) {
                        return 'Authentication required';
                    }
                    const { title, questions } = value;
                    const filteredQuestions = questions
                        .filter(q => q.text.trim() !== '')
                        .map(q => ({
                            text: q.text,
                            options: q.options.filter(opt => opt.trim() !== '')
                        }))
                        .filter(q => q.options.length > 0);

                    if (filteredQuestions.length === 0) {
                        return 'At least one question with one option is required';
                    }
                    let poll = null;

                    if (id) {
                        poll = await updatePoll(id, {
                            title,
                            questions: filteredQuestions,
                        });
                    } else {
                        poll = await createPoll({
                            title,
                            questions: filteredQuestions,
                        });
                    }

                    if ('error' in poll) {
                        return poll.message || 'Server error occurred';
                    }

                    if (poll && '_id' in poll) {
                        navigate(`/app/stats/${poll._id}`);
                    }

                    return null;
                } catch (error) {
                    const apiError = error as ApiError;
                    if (apiError && apiError.message) {
                        return apiError.message;
                    } else {
                        return 'An unknown error occurred';
                    }
                }
            },
        }
    });

    useEffect(() => {
        const fetchPoll = async () => {
            if (id && token) {
                setIsLoading(true);
                try {
                    const pollData = await getForm(id);
                    if (!('error' in pollData)) {
                        setPoll(pollData);
                        // Set form values after poll is loaded
                        form.setFieldValue('title', pollData.title);
                        form.setFieldValue('questions', pollData.questions.map(q => ({
                            text: q.text,
                            options: q.options
                        })));
                    }
                } catch (error) {
                    const apiError = error as ApiError;
                    if (apiError) {
                        setError(apiError.message);
                    } else {
                        setError('An unknown error occurred');
                    }
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchPoll();
    }, [id, token, form]);

    const validateTitle = {
        onChange: ({ value }: { value: string }) => {
            return !value ? 'Title is required' : value.length < 3 ? 'Title must be at least 3 characters' : undefined;
        }
    };

    const validateQuestionText = {
        onChange: ({ value }: { value: string }) => {
            return !value ? 'Question text is required' : undefined;
        }
    };

    const validateOptionText = {
        onChange: ({ value }: { value: string }) => {
            return !value ? 'Option text is required' : undefined;
        }
    };

    // Helper functions for managing questions array
    const addQuestion = () => {
        const currentQuestions = form.getFieldValue('questions') || [];
        form.setFieldValue('questions', [...currentQuestions, { text: '', options: [''] }]);
    };

    const removeQuestion = (questionIndex: number) => {
        const currentQuestions = form.getFieldValue('questions') || [];
        if (currentQuestions.length > 1) {
            form.setFieldValue('questions', currentQuestions.filter((_, index) => index !== questionIndex));
        }
    };

    const addOption = (questionIndex: number) => {
        const currentQuestions = form.getFieldValue('questions') || [];
        const newQuestions = [...currentQuestions];
        newQuestions[questionIndex].options.push('');
        form.setFieldValue('questions', newQuestions);
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        const currentQuestions = form.getFieldValue('questions') || [];
        if (currentQuestions[questionIndex].options.length > 1) {
            const newQuestions = [...currentQuestions];
            newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter(
                (_, index) => index !== optionIndex
            );
            form.setFieldValue('questions', newQuestions);
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    };

    if (id && isLoading) {
        return (
            <div className={style.formCreate__block}>
                <Loader />
            </div>
        );
    }

    if ((error || !poll) && id) {
        return (
            <div className={style.formInner__error}>Error: {error || "Poll not found"}</div>
        );
    }

    return (
        <div className={style.formCreate__block}>
            <GenerateForm
                popupState={popupState}
                onGenerate={(response) => {
                    form.setFieldValue('title', response.title);
                    form.setFieldValue('questions', response.questions.map(q => ({
                        text: q.text,
                        options: q.options
                    })));
                    
                    setTimeout(() => {
                        const titleField = form.getFieldMeta('title');
                        if (titleField) {
                            form.validateField('title', 'change');
                        }
                        
                        response.questions.forEach((question, questionIndex) => {
                            form.validateField(`questions[${questionIndex}].text`, 'change');
                            question.options.forEach((_, optionIndex) => {
                                form.validateField(`questions[${questionIndex}].options[${optionIndex}]`, 'change');
                            });
                        });
                    }, 0);
                }}
            />
            <div className={style.formCreate__titleContainer}>
                <h1 className={style.formCreate__title}>{`${id ? 'Update' : 'Create New'} Poll`}</h1>
                {!id ?
                    <ButtonWithIcon onClick={() => popupState[1](true)} children={'Generate'} icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path className={style.formCreate__icon} d="M22 14h-1c0-3.87-3.13-7-7-7h-1V5.73A2 2 0 1 0 10 4c0 .74.4 1.39 1 1.73V7h-1c-3.87 0-7 3.13-7 7H2c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h1v1a2 2 0 0 0 2 2h14c1.11 0 2-.89 2-2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1M9.79 16.5C9.4 15.62 8.53 15 7.5 15s-1.9.62-2.29 1.5c-.13-.31-.21-.64-.21-1a2.5 2.5 0 0 1 5 0c0 .36-.08.69-.21 1m9 0c-.39-.88-1.29-1.5-2.29-1.5s-1.9.62-2.29 1.5c-.13-.31-.21-.64-.21-1a2.5 2.5 0 0 1 5 0c0 .36-.08.69-.21 1"></path>
                        </svg>
                    } /> : <></>}
            </div>
            <form
                className={style.formCreate__form}
                onSubmit={handleSubmit}
            >
                <form.Field
                    name="title"
                    validators={validateTitle}
                    children={(field) => (
                        <div className={`${style.form__item} ${style.formCreate__item}`}>
                            <input
                                id={field.name}
                                name={field.name}
                                className={`${style.form__input} ${style.formCreate__input} ${field.state.meta.errors.length ? style.form__inputError : ''}`}
                                type="text"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder=" "
                            />
                            <label htmlFor={field.name} className={style.form__label}>Poll Title:</label>
                            <FieldInfo field={field} />
                        </div>
                    )}
                />

                <form.Subscribe
                    selector={(state) => [state.values.questions]}
                    children={([questions]) => (
                        <div className={style.formCreate__questions}>
                            <h2 className={style.formCreate__subtitle}>Questions</h2>

                            {questions?.map((question, questionIndex) => (
                                <div key={questionIndex} className={style.formCreate__questionBlock}>
                                    <div className={style.formCreate__questionHeader}>
                                        <h3 className={style.formCreate__questionTitle}>Question {questionIndex + 1}</h3>
                                        {questions.length > 1 && (
                                            <button
                                                type="button"
                                                className={style.formCreate__removeBtn}
                                                onClick={() => removeQuestion(questionIndex)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className={`${style.formCreate__item} ${style.form__item}`}>
                                        <form.Field
                                            name={`questions[${questionIndex}].text`}
                                            validators={validateQuestionText}
                                            children={(field) => (
                                                <>
                                                    <input
                                                        id={field.name}
                                                        name={field.name}
                                                        className={`${style.form__input} ${style.formCreate__input} ${field.state.meta.errors.length ? style.form__inputError : ''}`}
                                                        type="text"
                                                        value={field.state.value}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        placeholder=" "
                                                    />
                                                    <FieldInfo field={field} />
                                                </>
                                            )}
                                        />
                                        <label className={style.form__label}>Enter question text</label>
                                    </div>

                                    <div className={style.formCreate__options}>
                                        <h4 className={style.formCreate__optionsTitle}>Options</h4>

                                        {question.options.map((_, optionIndex) => (
                                            <div key={optionIndex} className={`${style.form__optionItem} ${style.form__item} ${style.formCreate__item}`}>
                                                <form.Field
                                                    name={`questions[${questionIndex}].options[${optionIndex}]`}
                                                    validators={validateOptionText}
                                                    children={(field) => (
                                                        <>
                                                            <input
                                                                id={field.name}
                                                                name={field.name}
                                                                className={`${style.form__input} ${style.formCreate__input} ${style.formCreate__inputOption} ${field.state.meta.errors.length ? style.form__inputError : ''}`}
                                                                type="text"
                                                                value={field.state.value}
                                                                onChange={(e) => field.handleChange(e.target.value)}
                                                                placeholder=' '
                                                            />
                                                            <FieldInfo field={field} />
                                                        </>
                                                    )}
                                                />
                                                <label className={style.form__label}>{`Option ${optionIndex + 1}`}</label>

                                                {question.options.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className={style.formCreate__removeOptionBtn}
                                                        onClick={() => removeOption(questionIndex, optionIndex)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M20 20L4 4m16 0L4 20"></path>
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            className={`${style.formCreate__addBtn} ${style.form__input} ${style.formCreate__input}`}
                                            onClick={() => addOption(questionIndex)}
                                        >
                                            <span>
                                                Add Option
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                className={style.formCreate__addBtnQuestion}
                                onClick={addQuestion}
                            >
                                Add Question
                            </button>
                        </div>
                    )}
                />

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting, state.errorMap]}
                    children={([canSubmit, isSubmitting, errorMap]) => (
                        <>
                            <button
                                className={style.form__sumbit}
                                type="submit"
                                disabled={Boolean(!canSubmit || isSubmitting)}
                            >
                                {isSubmitting ?
                                    id ? 'Updating...' : 'Creating...'
                                    :
                                    id ? 'Update Poll' : 'Create Poll'}
                            </button>
                            <span className={`${style.form__mainError} ${style.form__mainError__center}`}>
                                {typeof errorMap === 'object' && 'onSubmit' in errorMap ? errorMap.onSubmit : null}
                            </span>
                        </>
                    )}
                />
            </form>
        </div>
    );
};

export default CreateForm;