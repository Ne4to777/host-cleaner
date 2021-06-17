import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({path: './.env'});

const {STAFF_AUTH_TOKEN} = process.env;

const STAFF_HOST = 'https://staff-api.yandex-team.ru';
const STAFF_PATH = '/v3/persons?';

export type QueryParams = {
    query?: string,
    conditions?: string[],
    fields?: string[],
    limit?: number,
}
type GetQuery = (params: QueryParams) => string

export const getQuery: GetQuery = ({
    query = '',
    conditions = [],
    fields = [],
    limit = 0
}) => {
    const result = [];
    if (query) result.push(`_query=${encodeURIComponent(query)}`);
    if (conditions.length) result.push(conditions.join(','));
    if (fields.length) result.push(`_fields=${fields.join(',')}`);
    if (limit) result.push(`_limit=${limit}`);
    return result.join('&');
};

const STAFF_DISMISSED_QUERY = getQuery({
    limit: 5000,
    query: 'department_group.id==1694 or department_group.ancestors.id==1694',
    conditions: ['official.is_dismissed=true'],
    fields: ['login']
});

const HEADERS = {
    Authorization: `OAuth ${STAFF_AUTH_TOKEN}`
};

export const getRequest = (params: Record<string, any>): string => STAFF_HOST + STAFF_PATH + getQuery(params);

export const getUserById = (id:string): Promise<any> => axios
    .get(getRequest({conditions: [`login=${id}`]}), {
        headers: HEADERS
    })
    .then(res => res.data.result);

export const getUsersByIds = (ids:string[]): Promise<any> => axios
    .get(getRequest({
        conditions: [`login=${ids.join(',')}`],
        fields: ['login', 'work_email']
    }), {
        headers: HEADERS
    })
    .then(res => res.data.result);

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
