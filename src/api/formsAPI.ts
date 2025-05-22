import { ApiError, Poll, PollGenerator, PollShort } from '../types/inerfaces';
import { fetchWithAuth } from './apiClient';

interface CreatePollData {
  title: string;
  questions: {
    text: string;
    options: string[];
  }[];
}

const API_URL = process.env.REACT_APP_BACK_LINK;

export const getForms = async (): Promise<Poll[] | ApiError> => {
  return fetchWithAuth(`${API_URL}/polls`, {
    method: 'GET'
  });
};

export const getShortForms = async (id: string): Promise<PollShort | ApiError> => {
  return fetchWithAuth(`${API_URL}/polls/short/${id}`, {
    method: 'GET'
  });
};

export const getForm = async (id: string): Promise<Poll | ApiError> => {
  return fetchWithAuth(`${API_URL}/polls/${id}`, {
    method: 'GET'
  });
};

export const voteForm = async (id: string, answersArray: string[]): Promise<Poll | ApiError> => {
  return fetchWithAuth(`${API_URL}/polls/${id}/vote`, {
    method: 'POST',
    body: JSON.stringify({ questions: answersArray })
  });
};

export const checkVoteForm = async (id: string): Promise<{ isVoted: boolean; userId: string } | ApiError> => {
  return fetchWithAuth(`${API_URL}/polls/${id}/check-vote`, {
    method: 'GET'
  });
};

export const createPoll = async (pollData: CreatePollData): Promise<Poll | ApiError> => {
  return fetchWithAuth(`${API_URL}/polls`, {
    method: 'POST',
    body: JSON.stringify(pollData)
  });
};

export const updatePoll = async (id: string, pollData: CreatePollData): Promise<Poll | ApiError> => {
  return fetchWithAuth(`${API_URL}/polls/${id}/update`, {
    method: 'PUT',
    body: JSON.stringify(pollData)
  });
};

export const deletePoll = async (id: string): Promise<Poll | ApiError> => {
  return fetchWithAuth(`${API_URL}/polls/${id}`, {
    method: 'DELETE'
  });
};

export const generateAiPoll = async (data: {messagePrompt: string, numberQuestion: number}): Promise<PollGenerator | ApiError> => {
  return fetchWithAuth(`${API_URL}/polls/generate`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};