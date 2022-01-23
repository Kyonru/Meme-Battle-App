import axios, {AxiosInstance} from 'axios';
import {API_URL} from './constants';
import {mapErrors} from './utils';

const baseURL = API_URL;

axios.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error),
);

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.response.use(
  response => response.data,
  error => {
    if (error && (error.response || error.data)) {
      return Promise.reject(mapErrors(error.response.data));
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
