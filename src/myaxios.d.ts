import axios from 'axios';

let instance = axios.create({
    timeout: 1000 * 60,
    baseURL: import.meta.env.VITE_API_HOST,
    // headers: {
    //   'Content-Type': 'application/json;charset=UTF-8',
    // },
});

export default instance;