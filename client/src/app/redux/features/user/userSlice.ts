import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"

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
    setGuestUser: (state, action: PayloadAction<string>) => {
      state.user = {
        _id: action.payload,
        email: `${uuidv4()}@guestmail.com`,
        displayName: "Guest",
        activeGameId: "",
        isNewUser: false
      }
    },
    clearUser: (state) => {
      state.user = null
    }
  }
})

export const { setUser, setGuestUser, clearUser } = userSlice.actions
export default userSlice.reducer
