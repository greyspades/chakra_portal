import React, {createContext, useState} from 'react'
import { Candidate } from './types/candidate'
import { Role } from './types/roles'

export const MainContext = createContext(null)

const Context = (props: any) => {
    const [candidate, setCandidate] = useState<Candidate>()

    const [role, setRole] = useState<Role>()

    const [editableRole, setEditableRole] = useState<Role>()

    const [activePage, setActivePage] = useState<string>();

    const [candidates, setCandidates] = useState<Candidate[]>();

    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    return (
        <MainContext.Provider value={{candidate: candidate, setCandidate: setCandidate, role: role, setRole: setRole, editableRole: editableRole, setEditableRole, activePage, setActivePage, candidates, setCandidates, loggedIn, setLoggedIn} as any}>
            {props.children}
        </MainContext.Provider>
    )
}

export default Context