import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getForm } from "../api/formsAPI";
import { Poll, Question } from "../types/inerfaces";
import style from '../assets/styles/FormInner.module.scss';
import formStyle from '../assets/styles/Form.module.scss';
import Loader from "../components/UI/Loader";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "../components/UI/FieldInfo";

const WorkingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPoll = async () => {
            if (id && token) {
                try {
                    const pollData = await getForm(id, token);
                    setPoll(pollData);
                } catch (error) {
                    setError("Failed to load poll data");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };
        
        fetchPoll();
    }, [id, token]);

    const form = useForm({
        defaultValues: {
            answers: {} as Record<number, string>,
        },
        onSubmit: async ({ value }) => {
            try {
                // Преобразуем объект ответов в массив для API
                const answersArray = Object.values(value.answers);
                
                // Проверяем, что на все вопросы даны ответы
                if (poll && answersArray.length !== poll.questions.length) {
                    return { error: "Please answer all questions" };
                }
                
                await axios.post(
                    `${process.env.REACT_APP_BACK_LINK}/polls/${id}/vote`,
                    { questions: answersArray },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                
                // После успешного голосования перенаправляем на страницу статистики
                navigate(`/app/stats/${id}`);
                return { status: "success" };
            } catch (error) {
                console.error("Error submitting vote:", error);
                return { error: "Failed to submit your vote. Please try again." };
            }
        },
        validators: {
            onSubmit: ({ value }) => {
                if (poll && Object.keys(value.answers).length !== poll.questions.length) {
                    return "Please answer all questions";
                }
                return "";
            }
        }
    });

    if (loading) {
        return <Loader />;
    }

    if (error || !poll) {
        return <div className={style.formInner__error}>Error: {error || "Poll not found"}</div>;
    }

    return (
        <div className={style.formInner}>
            <div className={style.formInner__topBlock}>
                <Link className={style.formInner__linkContainer} to='/app/stats'>
                    <div className={style.formInner__topIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path className={style.formInner__icon} fillRule="evenodd" d="M10 2a1 1 0 0 0-1.79-.614l-7 9a1 1 0 0 0 0 1.228l7 9A1 1 0 0 0 10 20v-3.99c5.379.112 7.963 1.133 9.261 2.243c1.234 1.055 1.46 2.296 1.695 3.596l.061.335a1 1 0 0 0 1.981-.122c.171-2.748-.086-6.73-2.027-10.061C19.087 8.768 15.695 6.282 10 6.022z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <span className={style.formInner__iconText}>Back</span> 
                </Link>
            </div>

            <div className={style.formInner__pollStat}>
                <h1 className={style.formInner__title}>{poll.title}</h1>
                
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className={formStyle.form}
                >
                    {poll.questions.map((question, qIndex) => (
                        <div key={qIndex} className={style.formInner__item}>
                            <h2 className={style.formInner__subtitle}>{question.text}</h2>
                            <form.Field
                                name={`answers.${qIndex}`}
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!value) {
                                            return "Please select an option";
                                        }
                                        return "";
                                    }
                                }}
                            >
                                {(field) => (
                                    <div className={style.formInner__options}>
                                        {question.options.map((option, oIndex) => (
                                            <div key={oIndex} className={style.formInner__option}>
                                                <input
                                                    type="radio"
                                                    id={`q${qIndex}-o${oIndex}`}
                                                    name={`question-${qIndex}`}
                                                    value={option}
                                                    checked={field.state.value === option}
                                                    onChange={() => field.handleChange(option)}
                                                    className={formStyle.form__radio}
                                                />
                                                <label 
                                                    htmlFor={`q${qIndex}-o${oIndex}`}
                                                    className={formStyle.form__radioLabel}
                                                >
                                                    {option}
                                                </label>
                                            </div>
                                        ))}
                                        <FieldInfo field={field} />
                                    </div>
                                )}
                            </form.Field>
                        </div>
                    ))}

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
                                    disabled={!canSubmit || isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Vote'}
                                </button>
                            </>
                        )}
                    </form.Subscribe>
                </form>
            </div>
        </div>
    );
};

export default WorkingPage;