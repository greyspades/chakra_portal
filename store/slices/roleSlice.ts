import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { Role } from '../../types/roles';
import { Candidate } from '../../types/candidate';
import type { RootState } from '../store';

// import { } from 'react-redux'
// import { Action,  EntityState} from '@reduxjs/toolkit';

const initialState = {
  role:{
    name: "",
    status: "",
    description: "",
    id: "",
    experience: 0,
    deadline: new Date().toDateString(),
    unit: "",
    salary: "",
  },
};

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    // Action to add comment
    setRole: (state: any, action: PayloadAction) => {
      state.role = action.payload
    },
    extraReducers: {
      [HYDRATE]: (state: any, action: any) => {
        return {
          ...state,
          ...action.payload.comments,
        };
      },
    } as any,
  },
});

export const { setRole } = roleSlice.actions;
export const getRole = (state: RootState) => state.role
export default roleSlice.reducer;