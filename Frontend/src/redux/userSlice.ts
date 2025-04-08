import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  uid: string;
}
const localUid = localStorage.getItem("uid") || ""
;
const initialState: UserState = {
  uid: localUid
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      localStorage.setItem("uid", action.payload.uid);
      return { ...state, ...action.payload };
    },
    clearUser: () => {
      localStorage.removeItem("uid"); // clear on logout
      return initialState;
    }
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
