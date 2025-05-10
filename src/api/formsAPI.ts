import { Poll, PollGenerator, PollShort, QuestionGenerator } from '../types/inerfaces';

interface CreatePollData {
  title: string;
  questions: {
    text: string;
    options: string[];
  }[];
}

const API_URL = process.env.REACT_APP_BACK_LINK;

const handleResponse = async (response: Response): Promise<any> => {
  const data = await response.json();  
  return data;
};

export const getForms = async (token: string): Promise<Poll[]> => {
  const response = await fetch(`${API_URL}/polls`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  
  return handleResponse(response);
};

export const getShortForms = async (id: string, token: string): Promise<PollShort> => {
  const response = await fetch(`${API_URL}/polls/short/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  
  return handleResponse(response);
};

export const getForm = async (id: string, token: string): Promise<Poll> => {
  const response = await fetch(`${API_URL}/polls/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  
  return handleResponse(response);
};

export const voteForm = async (id: string, answersArray: string[], token: string): Promise<Poll> => {
  const response = await fetch(`${API_URL}/polls/${id}/vote`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ questions: answersArray }),
    credentials: 'include'
  });
  
  return handleResponse(response);
};

export const checkVoteForm = async (id: string, token: string): Promise<{ isVoted: boolean; userId: string }> => {
  const response = await fetch(`${API_URL}/polls/${id}/check-vote`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  
  return handleResponse(response);
};

export const createPoll = async (pollData: CreatePollData, token: string): Promise<Poll> => {
  const response = await fetch(`${API_URL}/polls`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pollData),
    credentials: 'include'
  });
  
  return handleResponse(response);
};

export const updatePoll = async (id: string, pollData: CreatePollData, token: string): Promise<Poll> => {
  const response = await fetch(`${API_URL}/polls/${id}/update`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pollData),
    credentials: 'include'
  });
  
  return handleResponse(response);
};

export const deletePoll = async (id: string, token: string): Promise<Poll> => {
  const response = await fetch(`${API_URL}/polls/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  
  return handleResponse(response);
};

export const generateAiPoll = async (token: string, data: {messagePrompt: string, numberQuestion: number}): Promise<PollGenerator> => {
  const response = await fetch(`${API_URL}/polls/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include'
  });
  
  return handleResponse(response);
};