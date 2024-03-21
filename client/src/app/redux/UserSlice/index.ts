import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistor } from "../store";

interface User {
  _id: string;
  email: string;
  displayName: string;
  activeGameId: string;
}

export interface UserState {
  user: null | User;
}

// * INITIAL STATE
const initialState: UserState = {
  user: null,
};

// TODO: TEST THIS BEFORE MOVING ON
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      console.log(`User set to: `, action.payload);
    },
    signOutUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, signOutUser } = userSlice.actions;
export default userSlice.reducer;
