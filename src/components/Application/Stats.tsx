import { useEffect, useState } from "react";
import { getForms } from "../../api/formsAPI";
import { ApiError, Poll } from "../../types/inerfaces";
import style from '../../styles/Application/index.module.scss';
import { Loader } from "../shared/index";

import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Stats = () => {
    const [form, setForm] = useState<Poll[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        getForms().then((res) => {
            if (!('error' in res)) {
                setForm(res);
            }
        }).catch((err) => {
            const apiError = err as ApiError;
            if (apiError) {
                setError(apiError.message);
            } else {
                setError('An unknown error occurred');
            }
        }).finally(() => {
            setLoading(false);
        });
    }, [token])


    if (loading) {
        return <Loader />;
    }

    if(error) {
        return <div className={style.formInner__error}>Error: {error}</div>;
    }
    return (
        <>
            <h1 className={style.stat__h1}>
                List of polls
            </h1>
            <ul className={style.stat__list}>
                {
                    form.map((el) => {
                        return (
                            <li key={el._id}>
                                <Link to={`/app/stats/${el._id}`} className={style.stat__block}>
                                    <h2 className={style.stat__title}>
                                        {el.title}
                                    </h2>
                                    <span className={style.stat__text}>Votes: {el.votedUsers.length}</span>
                                    <div className={style.stat__text}>
                                        <span className={style.stat__textTitle}>Date of creation: </span>
                                        <span>{new Date(el.createAt).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                    </div>

                                </Link>
                            </li>
                        ) 
                    })
                }
            </ul>
        </>
    )
}

export default Stats;