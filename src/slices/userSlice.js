import { createSlice } from '@reduxjs/toolkit'
import { act } from 'react-dom/test-utils'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):null,
  },
  reducers: {
    userLoginInfo: (state,action) => {
        state.userInfo=action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { userLoginInfo } = userSlice.actions

export default userSlice.reducer