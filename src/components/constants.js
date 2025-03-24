import { getAuthToken } from './store/Authentication';
export class Constants {
    static BASE_URL = 'http://localhost:3030/';
    static PROF_URL = this.BASE_URL + 'professor/';
}

export const ExamStatus = {
    NOT_STARTED: 'NOT_STARTED',
    ONGOING : 'ONGOING',
    COMPLETED : 'COMPLETED'
}

export const requestHeader = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + getAuthToken()
}