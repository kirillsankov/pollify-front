import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Question } from '../../types/inerfaces';
import { useEffect, useState } from 'react';

interface Props {
    questions: Question[];
}
interface IData {
    name: string;
    votes: number;
}

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
                    <> 
                        <h2>{questions[index].text}</h2>
                        <ResponsiveContainer minWidth="100%" minHeight="600px" key={index}>
                            <BarChart
                            data={question}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="votes" stackId="a" fill="#7334E6" />
                            </BarChart>
                        </ResponsiveContainer> 
                    </>
                ))
            }
        </>
    );
}