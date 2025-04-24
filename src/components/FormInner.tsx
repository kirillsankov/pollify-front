import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StackedBarChart from "./charts/StackedBarChart";
import { getForm } from "../api/formsAPI";
import { Poll, Question } from "../types/inerfaces";
import style from '../assets/styles/FormInner.module.scss';
import { AxiosError } from "axios";
import Loader from "./UI/Loader";
import { useAuth } from "../hooks/useAuth";
import ButtonWithIcon from "./UI/ButtonWithIcon";


const FormInner = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [poll, setPoll] = useState<Poll | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPoll = async () => {
            if (id && token) {
                try {
                    const poll = await getForm(id, token);
                    setPoll(poll);
                    setQuestions(poll.questions);
                } catch (error) {
                    setError(error instanceof AxiosError && error.response ? error.response.data.message : 'An unknown error occurred');
                }
            }
        };
        
        fetchPoll();
    }, [id, token]);

    if (error) {
        return <div className={style.formInner__error}>Error: {error}</div>;
    }

    if(!poll) {
        return (
            <Loader/>
         )
    }


    return (
        <div className={style.formInner}>
            <div className={style.formInner__topBlock}>
                <div className={style.formInner__topBlockLeft}>
                    <ButtonWithIcon 
                        stringTo="/app/stats"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path className={style.formInner__icon} fillRule="evenodd" d="M10 2a1 1 0 0 0-1.79-.614l-7 9a1 1 0 0 0 0 1.228l7 9A1 1 0 0 0 10 20v-3.99c5.379.112 7.963 1.133 9.261 2.243c1.234 1.055 1.46 2.296 1.695 3.596l.061.335a1 1 0 0 0 1.981-.122c.171-2.748-.086-6.73-2.027-10.061C19.087 8.768 15.695 6.282 10 6.022z" clipRule="evenodd"></path>
                            </svg>
                        }
                        children='Back'
                    />
                    <ButtonWithIcon 
                        stringTo={`/form/${id}`}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
                                <path className={style.formInner__icon} d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25v-1.5a.75.75 0 0 1 1.5 0v1.5A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2h1.5a.75.75 0 0 1 0 1.5zM8 2.75A.75.75 0 0 1 8.75 2h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V4.561l-3.22 3.22A.75.75 0 1 1 8.22 6.72l3.22-3.22H8.75A.75.75 0 0 1 8 2.75"></path>
                            </svg>
                        }
                        children='Open'
                    />
                </div>
                <ButtonWithIcon 
                    stringTo={`/app/edit/${id}`}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path className={style.formInner__icon} d="M16 2.012l3 3L16.713 7.3l-3-3zM4 14v3h3l8.299-8.287l-3-3zm0 6h16v2H4z"></path>
                        </svg>
                    }
                    children='Edit'
                />
            </div>
            <div className={style.formInner__pollStat}>
                <h1 className={style.formInner__title}>{poll.title}</h1>
                <span className={style.formInner__voted}>Voted users: {poll.votedUsers.length}</span>
                {questions && <StackedBarChart questions={questions}/>}
            </div>
        </div>
    )
}

export default FormInner;