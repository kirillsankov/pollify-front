import { useNavigate } from 'react-router-dom';
import style from '../assets/styles/Form.module.scss';
import { useForm } from '@tanstack/react-form';
import { FieldInfo } from './UI/FieldInfo';
import React, { useState, useEffect } from 'react';
import { createPoll } from '../api/formsAPI';

const CreateForm: React.FC = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([
        { text: '', options: [''], errors: { text: '', options: [''] } }
    ]);
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        const isValid = questions.every(q => 
            q.text.trim() !== '' && 
            q.options.some(opt => opt.trim() !== '')
        );
        setFormValid(isValid);
    }, [questions]);

    const form = useForm({
        defaultValues: {
            title: '',
        },
        validators: {
            onSubmitAsync: async ({ value }) => {
                try {
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
    
                    const poll = await createPoll({
                        title,
                        questions: filteredQuestions,
                    });
                    
                    navigate(`/app/stats/${poll._id}`);
                    return null;
                } catch (error) {
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

    return (
        <div className={style.formCreate__block}>
        <h1 className={style.formCreate__title}>Create New Poll</h1>
        <form 
            className={style.formCreate__form}
            onSubmit={handleSubmit}
        >
            <form.Field
                name="title"
                validators={validateTitle}
                children={(field) => (
                    <div className={style.form__item}>
                        <input
                            id={field.name}
                            name={field.name}
                            className={`${style.form__input} ${field.state.meta.errors.length ? style.form__inputError : ''}`}
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
                                className={`${style.form__input} ${question.errors.text ? style.form__inputError : ''}`}
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
                                <div key={optionIndex} className={`${style.form__optionItem} ${style.form__item}`}>
                                    <input
                                        className={`${style.form__input} ${style.formCreate__inputOption} ${question.errors.options[optionIndex] ? style.form__inputError : ''}`}
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
                                className={`${style.formCreate__addBtn} ${style.form__input}`}
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
                            {isSubmitting ? 'Creating...' : 'Create Poll'}
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