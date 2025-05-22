import { useState } from "react";
import { Popup, FieldInfo } from "../shared/index";
import { useForm } from "@tanstack/react-form";
import formStyle from '../../styles/Application/index.module.scss';
import { generateAiPoll } from "../../api/formsAPI";
import { useAuth } from "../../hooks/useAuth";
import { ApiError, PollGenerator } from "../../types/inerfaces";

interface IProps {
    popupState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    onGenerate: (item: PollGenerator) => void;
}

export const GenerateForm = ({popupState, onGenerate}: IProps) => {
    const [popup, setPopup] = popupState;
    const { token } = useAuth();

    const form = useForm({
        defaultValues: {
            topic: '',
            complexity: '3',
        },
        validators: {
            onSubmit: async ({ value }) => {
                try {
                    if (!token) {
                        return "You must be logged in to generate a poll" ;
                    }
                    const { topic, complexity } = value;
                    const response = await generateAiPoll({ messagePrompt: topic, numberQuestion: +complexity });
                    if (!('error' in response)) {
                        response.questions.forEach((question, index) => {
                            question.errors = { text: '', options: [''] };
                        });
                        setPopup(false);
                        onGenerate(response);
                    }
                } catch (error) {
                    const apiError = error as ApiError;
                    if (apiError) {
                        return apiError.message;
                    } else {
                        return 'An unknown error occurred';
                    }
                }
            } 
        }
    });

    return (
        <Popup isOpen={popup} onClose={() => setPopup(false)} title="Generate AI Poll">
            <div className={formStyle.form__block}>
                <h3 className={`${formStyle.form__subtitle} ${formStyle.popup__subtitle}`}>
                    Let AI generate a poll for you.
                </h3>
                
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className={formStyle.form}
                >
                    <form.Field
                        name="topic"
                        validators={{
                            onChange: ({ value }) => {
                                if (!value) {
                                    return "Topic is required";
                                }
                                if (value.length < 3) {
                                    return "Topic must be at least 3 characters";
                                }
                                return "";
                            }
                        }}
                    >
                        {(field) => (
                            <div className={`${formStyle.form__item} ${formStyle.formCreate__item}`}>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    className={`${formStyle.form__input} ${field.state.meta.errors.length ? formStyle.form__inputError : ''}`}
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder=' '
                                />
                                <label htmlFor={field.name} className={formStyle.form__label}>Topic:</label>
                                <FieldInfo field={field} />
                            </div>
                        )}
                    </form.Field>

                    <form.Field
                        name="complexity"
                        validators={{
                            onChange: ({ value }) => {
                                if (!value) {
                                    return "Number of questions is required";
                                }
                                const number = +value
                                if (number < 1) {
                                    return 'The number of questions should be 1 or more';
                                }
                                if (number > 20) {
                                    return "The number of questions should be 20 or less.";
                                }
                                return "";
                            }
                        }}
                    >
                        {(field) => (
                            <div className={`${formStyle.form__item} ${formStyle.formCreate__item}`}>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    className={`${formStyle.form__input} ${field.state.meta.errors.length ? formStyle.form__inputError : ''}`}
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder=' '
                                />
                                <label htmlFor={field.name} className={formStyle.form__label}>Number of questions:</label>
                                <FieldInfo field={field} />
                            </div>
                        )}
                    </form.Field>

                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting, state.errorMap]}
                    >
                        {([canSubmit, isSubmitting, errorMap]) => (
                            <>
                                <button 
                                    type="submit" 
                                    className={formStyle.form__sumbit}
                                    disabled={!canSubmit || !!isSubmitting}
                                >
                                    {isSubmitting ? 'Generating Poll...' : 'Generate Poll'}
                                </button>
                                <span className={`${formStyle.form__mainError} ${formStyle.form__mainError__center}`}>{typeof errorMap === 'object' && 'onSubmit' in errorMap ? errorMap.onSubmit : null}</span>
                            </>
                        )}
                    </form.Subscribe>
                </form>
            </div>
        </Popup>
    );
};

export default GenerateForm;