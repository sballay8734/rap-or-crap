import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface User {
  _id: string
  email: string
  displayName: string
  activeGameId: string

  isNewUser: boolean // flag NOT exist in DB. Used to prevent unnecessary fetch
}

interface UserState {
  user: null | User
}

// INITIAL STATE
const initialState: UserState = {
  user: null
}

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    clearUser: (state) => {
      state.user = null
    }
  }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
