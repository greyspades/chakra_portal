import React, {createContext, useState} from 'react'
import { Candidate } from './types/candidate'
import { Role } from './types/roles'

export const MainContext = createContext(null)

const Context = (props: any) => {
    const [candidate, setCandidate] = useState<Candidate>()

    const [role, setRole] = useState<Role>()

    const [editableRole, setEditableRole] = useState<Role>()

    return (
        <MainContext.Provider value={{candidate: candidate, setCandidate: setCandidate, role: role, setRole: setRole, editableRole: editableRole, setEditableRole} as any}>
            {props.children}
        </MainContext.Provider>
    )
}

export default Context