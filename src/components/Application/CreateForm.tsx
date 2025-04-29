import { useNavigate, useParams } from 'react-router-dom';
import style from '../../styles/Application/index.module.scss';

import { useForm } from '@tanstack/react-form';
import { FieldInfo, ButtonWithIcon } from '../shared/index';
import React, { useState, useEffect } from 'react';
import { createPoll, getForm, updatePoll } from '../../api/formsAPI';
import { Poll, QuestionGenerator } from '../../types/inerfaces';
import { useAuth } from '../../hooks/useAuth';
import { AxiosError } from 'axios';
import GenerateForm from './GenerateForm';

const CreateForm: React.FC = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const { token } = useAuth();
    const [questions, setQuestions] = useState<QuestionGenerator[]>([
        { text: '', options: [''], errors: { text: '', options: [''] } }
    ]);
    const [poll, setPoll] = useState<Poll | null>(null);
    const [formValid, setFormValid] = useState(false);
    const [error, setError] = useState<string | null>(null); 
    const [title, setTitle] = useState<string | null>(null);
    const popupState = useState<boolean>(false); 


    useEffect(() => {
        const fetchPoll = async () => {
            if (id && token) {
                try {
                    const poll = await getForm(id, token);
                    const questions = poll.questions.map(q => ({
                        text: q.text,
                        options: q.options,
                        errors: { text: '', options: q.options.map(() => '') }
                    }));
                    setPoll(poll);
                    setQuestions(questions); 
                } catch (error) {
                    if(error instanceof AxiosError && error?.response && error?.response?.data?.message) {
                        setError(error.response.data.message);
                    }
                    setError('Failed to create poll');
                }
            }
        };
        
        fetchPoll();
    }, [id, token]);

    useEffect(() => {
        const isValid = questions.every(q => 
            q.text.trim() !== '' && 
            q.options.some(opt => opt.trim() !== '')
        );
        setFormValid(isValid);
    }, [questions]);

    const form = useForm({
        defaultValues: {
            title: title || poll?.title || '',
        },
        validators: {
            onSubmitAsync: async ({ value }) => {
                try {
                    if (!token) {
                        return;
                    }
                    const { title } = value;
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
                    let poll = null
                    if(id) {
                        poll = await updatePoll(id, {
                            title,
                            questions: filteredQuestions,
                        }, token);
                    } else {
                        poll = await createPoll({
                            title,
                            questions: filteredQuestions,
                        }, token);
                    }
                    
                    navigate(`/app/stats/${poll._id}`);
                    return null;
                } catch (error) {
                    if(error instanceof AxiosError && error?.response && error?.response?.data?.message) {
                        return error.response.data.message;
                    }
                    console.error('Error creating poll:', error);
                    return 'Failed to create poll';
                }
            },
        }
    });

    const validateTitle = {
        onChange: ({ value }: { value: string }) => {
            return !value ? 'Title is required' : value.length < 3 ? 'Title must be at least 3 characters' : undefined;
        }
    };

    const validateQuestion = (text: string, questionIndex: number) => {
        const newQuestions = [...questions];
        if (!text.trim()) {
            newQuestions[questionIndex].errors.text = 'Question text is required';
        } else {
            newQuestions[questionIndex].errors.text = '';
        }
        setQuestions(newQuestions);
    };

    const validateOption = (text: string, questionIndex: number, optionIndex: number) => {
        const newQuestions = [...questions];
        if (!text.trim()) {
            newQuestions[questionIndex].errors.options[optionIndex] = 'Option cannot be empty';
        } else {
            newQuestions[questionIndex].errors.options[optionIndex] = '';
        }
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { 
            text: '', 
            options: [''], 
            errors: { text: '', options: [''] } 
        }]);
    };

    const removeQuestion = (questionIndex: number) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, index) => index !== questionIndex));
        }
    };

    const updateQuestionText = (questionIndex: number, text: string) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].text = text;
        validateQuestion(text, questionIndex);
        setQuestions(newQuestions);
    };

    const addOption = (questionIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options.push('');
        newQuestions[questionIndex].errors.options.push('');
        setQuestions(newQuestions);
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        if (questions[questionIndex].options.length > 1) {
            const newQuestions = [...questions];
            newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter(
                (_, index) => index !== optionIndex
            );
            newQuestions[questionIndex].errors.options = newQuestions[questionIndex].errors.options.filter(
                (_, index) => index !== optionIndex
            );
            setQuestions(newQuestions);
        }
    };

    const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = text;
        validateOption(text, questionIndex, optionIndex);
        setQuestions(newQuestions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const newQuestions = [...questions];
        let hasErrors = false;
        
        newQuestions.forEach((question, qIndex) => {
            if (!question.text.trim()) {
                question.errors.text = 'Question text is required';
                hasErrors = true;
            }
            
            let allOptionsEmpty = true;
            question.options.forEach((option, oIndex) => {
                if (!option.trim()) {
                    question.errors.options[oIndex] = 'Option cannot be empty';
                } else {
                    allOptionsEmpty = false;
                    question.errors.options[oIndex] = '';
                }
            });
            
            if (allOptionsEmpty) {
                hasErrors = true;
            }
        });
        
        setQuestions(newQuestions);
        
        if (!hasErrors) {
            form.handleSubmit();
        }
    };
    if ((error || !poll) && id) {
        return (
            <div className={style.formInner__error}>Error: {error || "Poll not found"}</div>
        )
    }

    return (
        <div className={style.formCreate__block}>
        <GenerateForm 
            popupState={popupState}
            onGenerate={(response) => {
                setQuestions(response.questions);
                setTitle(response.title);
            }}
        />
        <div className={style.formCreate__titleContainer}>
            <h1 className={style.formCreate__title}>{`${id ? 'Update' : 'Create New'} Poll`}</h1>
            {!id ?
            <ButtonWithIcon onClick={() => popupState[1](true)} children={'Generate'} icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path className={style.formCreate__icon} d="M22 14h-1c0-3.87-3.13-7-7-7h-1V5.73A2 2 0 1 0 10 4c0 .74.4 1.39 1 1.73V7h-1c-3.87 0-7 3.13-7 7H2c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h1v1a2 2 0 0 0 2 2h14c1.11 0 2-.89 2-2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1M9.79 16.5C9.4 15.62 8.53 15 7.5 15s-1.9.62-2.29 1.5c-.13-.31-.21-.64-.21-1a2.5 2.5 0 0 1 5 0c0 .36-.08.69-.21 1m9 0c-.39-.88-1.29-1.5-2.29-1.5s-1.9.62-2.29 1.5c-.13-.31-.21-.64-.21-1a2.5 2.5 0 0 1 5 0c0 .36-.08.69-.21 1"></path>
            </svg>
            }/> : <></>} 
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

            <div className={style.formCreate__questions}>
                <h2 className={style.formCreate__subtitle}>Questions</h2>
                
                {questions.map((question, questionIndex) => (
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
                            <input
                                className={`${style.form__input} ${style.formCreate__input} ${question.errors.text ? style.form__inputError : ''}`}
                                type="text"
                                value={question.text}
                                onChange={(e) => updateQuestionText(questionIndex, e.target.value)}
                                onBlur={(e) => validateQuestion(e.target.value, questionIndex)}
                                placeholder=" "
                            />
                            <label className={style.form__label}>Enter question text</label>
                            {question.errors.text && (
                                <div className={style.form__error}>{question.errors.text}</div>
                            )}
                        </div>
                        
                        <div className={style.formCreate__options}>
                            <h4 className={style.formCreate__optionsTitle}>Options</h4>
                            
                            {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className={`${style.form__optionItem} ${style.form__item} ${style.formCreate__item}`}>
                                    <input
                                        className={`${style.form__input} ${style.formCreate__input} ${style.formCreate__inputOption} ${question.errors.options[optionIndex] ? style.form__inputError : ''}`}
                                        type="text"
                                        value={option}
                                        onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                        onBlur={(e) => validateOption(e.target.value, questionIndex, optionIndex)}
                                        placeholder=' '
                                    />
                                    <label className={style.form__label}>{`Option ${optionIndex + 1}`}</label>
                                    
                                    {question.options.length > 1 && (
                                        <button 
                                            type="button" 
                                            className={style.formCreate__removeOptionBtn}
                                            onClick={() => removeOption(questionIndex, optionIndex)}
                                        >
                                            ×
                                        </button>
                                    )}
                                    
                                    {question.errors.options[optionIndex] && (
                                        <div className={style.form__error}>{question.errors.options[optionIndex]}</div>
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

            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting, state.errorMap]}
                children={([canSubmit, isSubmitting, errorMap]) => (
                    <>
                        <button 
                            className={style.form__sumbit} 
                            type="submit" 
                            disabled={!canSubmit || !formValid}
                        >
                            {isSubmitting ? 
                                id ? 'Updating...' :'Creating...' 
                            : 
                                id ? 'Update Poll' : 'Create Poll'}
                        </button>
                        <span className={style.form__mainError}>
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