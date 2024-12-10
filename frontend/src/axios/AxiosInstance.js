import axios from "axios";
import { API_BASE_URL, TASK_URL } from "../constants/urls";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { refreshauthToken } from "./ApiServers";

export const axiosInstance = axios.create({
    baseURL: TASK_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    async function (config) {
        const tokens = JSON.parse(localStorage.getItem('authTokens'));
        const accessToken = tokens.access;
        const refreshToken = tokens.refresh;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            const user = jwtDecode(accessToken)
            const isExp = dayjs.unix(user.exp).diff(dayjs()) < 1
            if(isExp){
                console.log('I was called');
                const res = await refreshauthToken()
                console.log(res, 'res');
                
                if (res.status === 200 || res.status === 201){
                    config.headers.Authorization = `Bearer ${res.data.access}`
                    localStorage.setItem('authTokens', JSON.stringify(res.data));
                }else{
                    console.log(res)
                }
            }
        } 
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export const axiosFormInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});

axiosFormInstance.interceptors.request.use(
    async function (config) {
        const tokens = JSON.parse(localStorage.getItem('authTokens'));
        const accessToken = tokens.access;
        const refreshToken = tokens.refresh;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            const user = jwtDecode(accessToken)
            const isExp = dayjs.unix(user.exp).diff(dayjs()) < 1
            if(isExp) {
                const res = await axios.post(`${API_BASE_URL}token/refresh/`, { refresh: refreshToken})
                if (res.status === 200 || res.status === 201) {
                    config.headers.Authorization = `Bearer ${res.data.access}`
                    localStorage.setItem('authTokens', JSON.stringify(res.data));
                } else {
                    console.log(res)
                }
            }
        }
        return config;
    },
    function (error) {
        return Promise.reject(error)
    }
);

