import {
    Action,
    configureStore,
    ThunkAction,
  } from '@reduxjs/toolkit';
import candidateReducer from './slices/candidateSlice'
import roleReducer from './slices/roleSlice'
  
  export const store = configureStore({
    reducer: {
        role: roleReducer,
        candidate: candidateReducer
    },
  });
  
  export type AppDispatch = typeof store.dispatch;
  export type RootState = ReturnType<typeof store.getState>;
  export type AppThunk<ReturnType = void> = ThunkAction<
     ReturnType,
     RootState,
     unknown,
     Action<any>
   >;