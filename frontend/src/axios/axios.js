import axios from 'axios'
import { API_BASE_URL } from '../constants/urls';

const apiInstance = axios.create({

    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});

export default apiInstance