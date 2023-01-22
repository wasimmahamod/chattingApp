import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatInfo: 'mern2201',
  },
  reducers: {
    chatUserInfo: (state,action) => {
        state.chatInfo=action.payload
    },

  },
})

export const { chatUserInfo } = chatSlice.actions

export default chatSlice.reducer