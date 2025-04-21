import axios from 'axios';
import { Poll } from '../types/inerfaces';

export const getForms = async (): Promise<Poll[]> => {
  const response = await axios.get(`${process.env.REACT_APP_BACK_LINK}/polls`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

interface CreatePollData {
  title: string;
  questions: {
    text: string;
    options: string[];
  }[];
}

export const createPoll = async (pollData: CreatePollData): Promise<Poll> => {
  const response = await axios.post(
    `${process.env.REACT_APP_BACK_LINK}/polls`, 
    pollData,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};