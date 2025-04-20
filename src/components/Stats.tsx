import { useEffect, useState } from "react";
import { getForms } from "../api/formsAPI";
import { Poll } from "../types/inerfaces";

const Stats = () => {
    const [form, setForm] = useState<Poll[]>([]);

    useEffect(() => {
        getForms().then((res) => {
            setForm(res);
        });
    }, [])


    return (
        <ul>
            {
                form.map((el) => {
                    return (
                        <li key={el._id}>
                            <div>
                                <h2>
                                    {el.title}
                                </h2>
                                <span>{el.title}</span>
                                <span>{el.expiresAt}</span>
                                <span>{el.authorId}</span>
                            </div>
                        </li>
                    ) 
                })
            }
        </ul>
    )
}

export default Stats;