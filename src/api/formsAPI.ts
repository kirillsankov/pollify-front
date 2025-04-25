import axios from 'axios';
import { Poll } from '../types/inerfaces';
interface CreatePollData {
  title: string;
  questions: {
    text: string;
    options: string[];
  }[];
}

export const getForms = async (token: string): Promise<Poll[]> => {
  const response = await axios.get(`${process.env.REACT_APP_BACK_LINK}/polls`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getForm = async (id: string, token: string): Promise<Poll> => {
  const response = await axios.get(`${process.env.REACT_APP_BACK_LINK}/polls/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const voteForm = async (id: string, answersArray: string[], token: string): Promise<Poll> => {
  const response = await axios.post(
    `${process.env.REACT_APP_BACK_LINK}/polls/${id}/vote`,
    { questions: answersArray },
    {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
);
  return response.data;
};

export const createPoll = async (pollData: CreatePollData, token: string): Promise<Poll> => {
  const response = await axios.post(
    `${process.env.REACT_APP_BACK_LINK}/polls`, 
    pollData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const updatePoll = async (id: string, pollData: CreatePollData, token: string): Promise<Poll> => {
  const response = await axios.put(
    `${process.env.REACT_APP_BACK_LINK}/polls/${id}/update`, 
    pollData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const deletePoll = async (id: string, token: string): Promise<Poll> => {
  const response = await axios.delete(
    `${process.env.REACT_APP_BACK_LINK}/polls/${id}`, 
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};