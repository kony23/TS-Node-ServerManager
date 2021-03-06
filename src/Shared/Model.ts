import {Account} from '../Server/Model';

export enum AccessRight {
    CREATE,
    READ,
    UPDATE,
    DELETE
}

export interface UserCredentials extends Account {
    accessRights: AccessRight[]
}

export enum HTTP_CODES {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORiZED = 401,
    NOT_FOUND = 404
}

export enum HTTP_METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS'
}

export interface User {
    id: string,
    name: string,
    age: number,
    email: string,
    workingPosition: WorkingPosition
}

export enum WorkingPosition {
    JUNIOR,
    PROGRAMMER,
    ENGINEER,
    EXPERT,
    MANNAGER
}