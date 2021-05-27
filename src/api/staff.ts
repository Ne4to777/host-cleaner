import * as dotenv from 'dotenv';
import axios from 'axios';

import {getQuery} from '../utils';

dotenv.config({path: './.env'});

const {STAFF_AUTH_TOKEN} = process.env;

const STAFF_HOST = 'https://staff-api.yandex-team.ru';
const STAFF_PATH = '/v3/persons?';
const STAFF_QUERY = '_fields=department_group&login=';

const STAFF_DISMISSED_QUERY = getQuery({
    limit: 5000,
    query: 'department_group.id==1694 or department_group.ancestors.id==1694',
    conditions: ['official.is_dismissed=true'],
    fields: ['login']
});

const HEADERS = {
    Authorization: `OAuth ${STAFF_AUTH_TOKEN}`
};

const getUserIdUrl = (id:string) => STAFF_HOST + STAFF_PATH + STAFF_QUERY + id;

const getUserById = (id:string) => axios
    .get(getUserIdUrl(id), {
        headers: HEADERS
    })
    .then(res => res.data.result[0].department_group);

const ALL_USERS_DISMISSED_URL = STAFF_HOST + STAFF_PATH + STAFF_DISMISSED_QUERY;

type User = any
type GetUsersByQuery = (query:string)=> Promise<User[]>
export const getUsersByQuery: GetUsersByQuery = query => axios
    .get(query, {
        headers: HEADERS
    })
    .then(res => res.data.result);

type GetAllDismissedUsers = () => Promise<User[]>
export const getAllDismissedUsers: GetAllDismissedUsers = () => getUsersByQuery(ALL_USERS_DISMISSED_URL)
    .then(response => response.map(user => user.login));

let allDismissedUsersCache: User[];
export const getAllDismissedUsersCached: GetAllDismissedUsers = async () => {
    if (!allDismissedUsersCache) allDismissedUsersCache = await getAllDismissedUsers();
    return allDismissedUsersCache;
};
