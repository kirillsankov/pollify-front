import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Question } from '../../types/inerfaces';
import { useEffect, useState } from 'react';
import style from '../../styles/Application/index.module.scss';


interface Props {
    questions: Question[];
}
interface IData {
    name: string;
    votes: number;
}

const COLORS = ['#7334E6', '#34C3E6', '#E67334', '#34E673', '#E63473', '#73E634', '#3473E6', '#E6C334'];

export default function StackedBarChart({ questions } :Props)  {
    const [pollData, setPollData] = useState<IData[][] | null>(null);

    useEffect(() => {
        const data:IData[][] = [];
        
        const fetchPoll = async () => {
            questions.forEach(question => {
                const questionsArr:IData[] = [];
                for(const vote of Object.keys(question.votes)) {
                    questionsArr.push({
                        name: vote,
                        votes: question.votes[vote] 
                    })
                }
                data.push(questionsArr)
            });
            if(data?.length) {
                setPollData(data);
            }
        };
        
        fetchPoll();
    }, [questions]); 

    if (!pollData) {
        return <div>Loading...</div>;
    }
    
    return (
        <>
            {
                pollData.map((question: IData[], index: number) => (
                    <div className={style.formInner__item} key={`chart-item-${index}`}> 
                        <h2 className={style.formInner__subtitle}>{questions[index].text}</h2>
                        <div className={style.formInner__chartContainer}>
                           <div className={style.formInner__chartWrapper}>
                            <ResponsiveContainer width="100%" className={style.formInner__chart}>
                                    <BarChart
                                        data={question}
                                        margin={{
                                            top: 20,
                                            right: 0,
                                            left: 0,
                                            bottom: 0
                                        }}
                                        >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="name" 
                                            tick={false}
                                            height={20}
                                        />
                                        <YAxis width={30} />
                                        <Tooltip/>
                                        <Bar dataKey="votes" stackId="a">
                                            {question.map((entry, i) => (
                                                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                           </div>

                        </div>
                        <ul className={style.formInner__chartLegend}>
                                {question.map((item, i) => (
                                    <li key={i} className={style.formInner__chartLegendItem}>
                                        <span 
                                            className={style.formInner__chartLegendColor} 
                                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                        ></span>
                                        <span className={style.formInner__chartLegendText}>
                                            <span style={{ color: COLORS[i % COLORS.length], fontWeight: 'bold' }}>
                                                {item.name}
                                            </span> - <strong>{item.votes} voted</strong>
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))
            }
        </>
    );
}