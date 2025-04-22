import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StackedBarChart from "./charts/StackedBarChart";
import { getForm } from "../api/formsAPI";
import { Poll, Question } from "../types/inerfaces";
import style from '../assets/styles/FormInner.module.scss';


const FormInner = () => {
    const { id } = useParams();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [poll, setPoll] = useState<Poll | null>(null);

    useEffect(() => {
        const fetchPoll = async () => {
            if (id) {
                const poll = await getForm(id);
                setPoll(poll);
                setQuestions(poll.questions);
            }
        };
        
        fetchPoll();
    }, [id]);

    if(!poll) {
        return (
            <div>Load...</div> 
         )
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
                <Link className={style.formInner__linkContainer} to={'/'}>
                    <div className={`${style.formInner__topIcon} ${style.formInner__topIcon__revert}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path className={style.formInner__icon} d="M16 2.012l3 3L16.713 7.3l-3-3zM4 14v3h3l8.299-8.287l-3-3zm0 6h16v2H4z"></path>
                        </svg>
                    </div>
                    <span className={style.formInner__iconText}>Edit</span> 
                </Link>
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