import { AuthDataKeys } from '../utils/constants';
import { signOut } from './store/reducers';
import { store } from './store';
import axiosObject from 'axios';

const accessToken = localStorage.getItem(AuthDataKeys.ACCESS_TOKEN);
const axios = axiosObject.create();
axios.defaults.baseURL = process.env.REACT_APP_API_HOST;

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response.status == 401) {
            store.dispatch(signOut());
        }
    },
);

if (accessToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

export default axios;
