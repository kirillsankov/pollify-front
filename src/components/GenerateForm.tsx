import { useState } from "react";
import Popup from "./UI/Popup";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "./UI/FieldInfo";
import formStyle from '../assets/styles/Form.module.scss';
import { generateAiPoll } from "../api/formsAPI";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { PollGenerator, QuestionGenerator } from "../types/inerfaces";

interface IProps {
    popupState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    onGenerate: (item: PollGenerator) => void;
}

export const GenerateForm = ({popupState, onGenerate}: IProps) => {
    const [popup, setPopup] = popupState;
    const { token } = useAuth();
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);

    const form = useForm({
        defaultValues: {
            topic: '',
            complexity: 'medium',
        },
        onSubmit: async ({ value }) => {
            try {
                setIsGenerating(true);
                if (!token) {
                    return { error: "You must be logged in to generate a poll" };
                }
                const { topic, complexity } = value;
                const response = await generateAiPoll(token, { messagePrompt: topic, numberQuestion: +complexity });
                
                response.questions.forEach((question, index) => {
                    question.errors = { text: '', options: [''] };
                });
                setPopup(false);
                onGenerate(response);
                
                return { status: "success" };
            } catch (error) {
                console.error("Error generating poll:", error);
                return { error: "Failed to generate poll. Please try again." };
            } finally {
                setIsGenerating(false);
            }
        }
    });

    return (
        <Popup isOpen={popup} onClose={() => setPopup(false)} title="Generate AI Poll">
            <div className={formStyle.form__block}>
                <p className={formStyle.form__subtitle}>
                    Let AI generate a poll for you. Just provide a topic and complexity level.
                </p>
                
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
                            <div className={formStyle.form__item}>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    className={`${formStyle.form__input} ${field.state.meta.errors.length ? formStyle.form__inputError : ''}`}
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder=' '
                                />
                                <label htmlFor={field.name} className={formStyle.form__label}>Title:</label>
                                <FieldInfo field={field} />
                            </div>
                        )}
                    </form.Field>

                    <form.Field
                        name="complexity"
                    >
                        {(field) => (
                            <div className={formStyle.form__item}>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    className={`${formStyle.form__input} ${field.state.meta.errors.length ? formStyle.form__inputError : ''}`}
                                    type="number"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder=' '
                                />
                                <label htmlFor={field.name} className={formStyle.form__label}>Number:</label>
                                <FieldInfo field={field} />
                            </div>
                        )}
                    </form.Field>

                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                    >
                        {([canSubmit, isSubmitting, submitError]) => (
                            <>
                                {submitError && (
                                    <div className={formStyle.form__error}>{submitError}</div>
                                )}
                                <button 
                                    type="submit" 
                                    className={formStyle.form__submit}
                                    disabled={!canSubmit || isSubmitting || isGenerating}
                                >
                                    {isGenerating ? 'Generating Poll...' : 'Generate Poll'}
                                </button>
                            </>
                        )}
                    </form.Subscribe>
                </form>
            </div>
        </Popup>
    );
};

export default GenerateForm;