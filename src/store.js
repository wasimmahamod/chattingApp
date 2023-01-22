import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import chatSlice  from './slices/chatSlice';

export default configureStore({
  reducer: {
    userLoginInfo:userSlice,
    chatUserInfo:chatSlice,
  },
})