import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  uid: string;
  id: string;
}

const initialState: UserState = {
  uid: "",
  id: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
