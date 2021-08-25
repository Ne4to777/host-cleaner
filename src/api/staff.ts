import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({path: './.env'});

type User = any

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
    if (conditions.length) result.push(conditions.join('&'));
    if (fields.length) result.push(`_fields=${fields.join(',')}`);
    if (limit) result.push(`_limit=${limit}`);
    return result.join('&');
};

const HEADERS = {
    Authorization: `OAuth ${STAFF_AUTH_TOKEN}`
};

export const getRequest = (params: QueryParams): string => STAFF_HOST + STAFF_PATH + getQuery(params);

export const get = (query: QueryParams, params: any = {}): Promise<User[]> => axios
    .get(getRequest(query), {
        ...params,
        headers: {
            ...params.headers,
            ...HEADERS
        }
    })
    .then(res => res.data.result);

export const getUserById = (id: string): Promise<User[]> => get({conditions: [`login=${id}`]});

export const getUsersByIds = (ids: string[]): Promise<User[]> => get({
    conditions: [`login=${ids.join(',')}`],
    fields: ['login', 'work_email']
});

type GetAllDismissedUsers = () => Promise<User[]>
export const getAllDismissedUsers: GetAllDismissedUsers = () => get({
    limit: 5000,
    query: 'department_group.id==1694 or department_group.ancestors.id==1694',
    conditions: ['official.is_dismissed=true', 'official.is_robot=false'],
    fields: ['login']
})
    .then(response => response.map(user => user.login));

let allDismissedUsersCache: User[];
export const getAllDismissedUsersCached: GetAllDismissedUsers = async () => {
    if (!allDismissedUsersCache) allDismissedUsersCache = await getAllDismissedUsers();
    return allDismissedUsersCache;
};
