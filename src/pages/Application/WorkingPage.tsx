import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { checkVoteForm, getForm, getShortForms, voteForm } from "../../api/formsAPI";
import { Poll, PollShort, Question } from "../../types/inerfaces";
import { Loader } from "../../components/shared/index";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "../../components/shared/index";
import style from '../../styles/Application/index.module.scss';



const WorkingPage = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [poll, setPoll] = useState<PollShort | null>(null);
    const [loading, setLoading] = useState(true);
    const [voted, setVoted] = useState<{ isVoted: boolean; userId: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchPoll = async () => {
        if (id && token) {
            try {
                const pollData = await getShortForms(id);
                const isVotedPoll = await checkVoteForm(id);
                setVoted(isVotedPoll)
                setPoll(pollData);
            } catch (error) {
                setError("Failed to load poll data");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };
    useEffect(() => {
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
                    await voteForm(id, answersArray);
                    fetchPoll();
                    window.scrollTo(0, 0);
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

    const isVoteCurrent = (item: Question, option: string) => {
        const votedString = item.votedUsers.find((item) => {
            if(item.startsWith(voted?.userId || '')) {
                return true;
            }
        })
        if(!votedString) {
            return '';
        }
        const optionVoted = votedString.split('-').slice(1, votedString.length).join('-');
        if(optionVoted === option) {
            return style.form__radioLabel__selected;
        }
    };

    if (loading) {
        return <Loader />;
    }

    if(voted?.isVoted) {
        return (
            <div className={`${style.container}  ${style.formShown} ${style.formInner__pollStat}`}>
                <h1 className={`${style.formInner__title} ${style.formShown__title} ${style.formShown__title__success}`}>
                You have successfully completed the "{poll?.title}" survey, below are your results</h1>
                <div className={style.formShown__item}>
                    {poll?.questions.map((item, qIndex) => {
                        return (
                        <div key={qIndex} className={style.formShown__item}>
                            <h2 className={`${style.formInner__subtitle} ${style.formShown__subtitle}`}>{item.text}</h2>
                            <div className={`${style.form__radioContainer}`}>
                            {
                                item.options.map((option) => {
                                    return (
                                        <div className={`${style.form__radioLabel} ${isVoteCurrent(item, option)}`}>
                                            {option}
                                        </div>
                                    )
                                })
                            }
                            </div>
                        </div>
                        )
                    })}
                </div>
             </div>
        )
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