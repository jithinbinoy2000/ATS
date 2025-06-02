//src\store\store.js
import { configureStore } from '@reduxjs/toolkit';
 import filesReducer from '../store/fileSlice';

const store = configureStore({
  reducer: {
    files:filesReducer,
  },
});
 store.subscribe(()=>{
  console.log("%c Store has been changed","color:green")
  console.log(store.getState());
 })
export default store;
