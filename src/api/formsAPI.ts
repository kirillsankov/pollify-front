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