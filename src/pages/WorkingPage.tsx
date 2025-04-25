import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { getForm, voteForm } from "../api/formsAPI";
import { Poll } from "../types/inerfaces";
import style from '../assets/styles/WorkingPage.module.scss';
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
        validators: {
            onSubmit: async ({ value }) => {
                try {
                    const answersArray = Object.values(value.answers);
                    
                    if (poll && answersArray.length !== poll.questions.length) {
                        return "Please answer all questions";
                    }
                    if(!id || !token) {
                        return "Error";
                    }
                    await voteForm(id, answersArray, token);
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
                    
                    navigate(`/app/stats/${id}`);
                    // return { status: "success" };
                } catch (error) {
                    console.log(error);
                    if(error instanceof AxiosError && error?.response && error?.response?.data?.message) {
                        return error.response.data.message;
                    }
                    console.error("Error submitting vote:", error);
                    return "Failed to submit your vote. Please try again.";
                }
            },
        }
    });

    if (loading) {
        return <Loader />;
    }

    if (error || !poll) {
        return (
            <div className={`${style.container}  ${style.formShown}`}>
                <div className={style.formInner__error}>Error: {error || "Poll not found"}</div>
             </div>
        )
    }

    return (
        <div className={`${style.formInner} ${style.container} ${style.formShown}`}>
            <div className={style.formInner__pollStat}>
                <h1 className={`${style.formInner__title} ${style.formShown__title}`}>{poll.title}</h1>
                
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className={style.form}
                >
                    {poll.questions.map((question, qIndex) => (
                        <div key={qIndex} className={style.formShown__item}>
                            <h2 className={`${style.formInner__subtitle} ${style.formShown__subtitle}`}>{question.text}</h2>
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
                                    <div className={style.form__radioContainer}>
                                        {question.options.map((option, oIndex) => (
                                            <div key={oIndex}>
                                                <input
                                                    type="radio"
                                                    id={`q${qIndex}-o${oIndex}`}
                                                    name={`question-${qIndex}`}
                                                    value={option}
                                                    checked={field.state.value === option}
                                                    onChange={() => field.handleChange(option)}
                                                    className={style.form__radio}
                                                />
                                                <label 
                                                    htmlFor={`q${qIndex}-o${oIndex}`}
                                                    className={style.form__radioLabel}
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
                        selector={(state) => [state.canSubmit, state.isSubmitting, state.errorMap]}
                    >
                        {([canSubmit, isSubmitting, errorMap]) => (
                            <>
                                <button 
                                    type="submit" 
                                    className={style.form__sumbit}
                                    disabled={!canSubmit as boolean  || isSubmitting as boolean }
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Vote'}
                                </button>
                                <span className={`${style.form__mainError} ${style.formShown__errorMain}`}>{typeof errorMap === 'object' && 'onSubmit' in errorMap ? errorMap.onSubmit : null}</span>

                            </>
                        )}
                    </form.Subscribe>
                </form>
            </div>
        </div>
    );
};

export default WorkingPage;