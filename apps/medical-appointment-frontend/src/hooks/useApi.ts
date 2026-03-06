import { http } from '../api/http.ts';

export const useApi = () => {

    return { api: http };
};
