import { type } from "os"

export type Role = {
    name: string,
    status?: string,
    description?: string,
    id?: string,
    experience?: number,
    deadline?: string,
    unit?: string,
    salary?: string,
    code?: string,
    location?: string,
    office?: string,
    skills?: string[] | string,
    qualification?: string,
    expanded?: boolean,
    jobtype?: string
}

export type Fields = {
    name: string,
    icon: any,
    placeholder: string
}

export type EditProps = {
    editing?: boolean,
    cancel?: () => void,
    role?: Role
}