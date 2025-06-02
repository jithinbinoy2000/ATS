// src/store/filesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const filesSlice = createSlice({
  name: 'files',
  initialState: [],
  reducers: {
    setFiles: (state, action) => {
       const newFiles = Array.isArray(action.payload) ? action.payload : [action.payload];
       console.log("1",...state ,"2",...newFiles)
       return [...state, ...newFiles];
    }
   
  },
});

export const { setFiles } = filesSlice.actions;
export default filesSlice.reducer;
