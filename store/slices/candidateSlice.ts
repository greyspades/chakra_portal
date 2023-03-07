import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { Role } from "../../types/roles";
import { Candidate } from "../../types/candidate";
import type { RootState } from "../store";

// import { } from 'react-redux'
// import { Action,  EntityState} from '@reduxjs/toolkit';

const initialState = {
  // candidate: {
  //   // applicationDate: new Date().toDateString(),
  //   // cv: "",
  //   // dob: new Date().toDateString(),
  //   // email: "",
  //   // firstName: "",
  //   // lastName: "",
  //   // password: "",
  //   // roleId: "",
  //   // phone: ""
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   password: "",
  //   phone: "",
  //   roleId: "",
  //   dob: "",
  // },
  value: ""
};

export const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    setCandidate: (state: any, action: PayloadAction<string>): any => {
      state.value = action.payload
    },
    // Special reducer for hydrating the state
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

export const { setCandidate } = candidateSlice.actions;
export const getCandidate = (state: RootState) => state.candidate;
export default candidateSlice.reducer;
