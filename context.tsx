import React, {createContext, useState} from 'react'
import { Candidate } from './types/candidate'
import { Role } from './types/roles'

export const MainContext = createContext(null)

const Context = (props: any) => {
    const [candidate, setCandidate] = useState<Candidate>();

    const [role, setRole] = useState<Role>();

    const [editableRole, setEditableRole] = useState<Role>();

    const [cvData, setCvData] = useState<{[key: string]: string}>();

    const [cvMeta, setCvMeta] = useState<{[key: string]: string}>();

    return (
        <MainContext.Provider value={{candidate: candidate, setCandidate: setCandidate, role: role, setRole: setRole, editableRole: editableRole, setEditableRole, cvData, setCvData, cvMeta, setCvMeta} as any}>
            {props.children}
        </MainContext.Provider>
    )
}

export default Context