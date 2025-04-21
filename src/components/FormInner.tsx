import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StackedBarChart from "./charts/StackedBarChart";
import { getForm } from "../api/formsAPI";
import { Poll, Question } from "../types/inerfaces";


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
        <div style={{
            width: '100%',
        }}>
            <Link to='/app/stats'>
                Back
            </Link>
            <button>
                Edit
            </button>
            <div style={{
                width: '100%',
            }}>
                <h1>{poll.title}</h1>
                <span>Voted users: {poll.votedUsers.length}</span>
                {questions && <StackedBarChart questions={questions}/>}
            </div>
        </div>
    )
}

export default FormInner;