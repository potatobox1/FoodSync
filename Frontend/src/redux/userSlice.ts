import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  firebase_uid: string;
  email: string;
  name: string;
  user_type: string 
  photoURL: string | null;
  user_id : string
  type_id : string    // will hold either food bank id or restaurant id depending on the type
}
const localUid = localStorage.getItem("firebase_uid") || "";
const localemail = localStorage.getItem("email") || "";
const localname = localStorage.getItem("name") || "";
const localtype = localStorage.getItem("user_type") || "";
const localurl = localStorage.getItem("photoURL") || null;
const localid = localStorage.getItem("user_id") || "";
const localtypeid = localStorage.getItem("type_id") || "";


const initialState: UserState = {
  firebase_uid: localUid ,
  email: localemail ,
  name: localname ,
  user_type: localtype,
  photoURL : localurl ,
  user_id: localid,
  type_id: localtypeid,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      localStorage.setItem("firebase_uid", action.payload.firebase_uid);
      localStorage.setItem("email", action.payload.email );
      localStorage.setItem("name", action.payload.name );
      localStorage.setItem("user_type", action.payload.user_type );
      localStorage.setItem("photoURL", action.payload.photoURL?? "" );
      localStorage.setItem("user_id", action.payload.user_id );
      localStorage.setItem("type_id", action.payload.type_id );
      

      return { ...state, ...action.payload };
    },
    setFirebaseUid: (state, action: PayloadAction<{ firebase_uid: string, photoURL: string | null }>) => {
      localStorage.setItem("firebase_uid", action.payload.firebase_uid);
      localStorage.setItem("photoURL", action.payload.photoURL ?? "");
      
      state.firebase_uid = action.payload.firebase_uid;
      state.photoURL = action.payload.photoURL;

    },
    clearUser: () => {
      localStorage.removeItem("firebase_uid"); // clear on logout
      localStorage.removeItem("email")
      localStorage.removeItem("name")
      localStorage.removeItem("user_type")
      localStorage.removeItem("photoURL")
      localStorage.removeItem("user_id")
      localStorage.removeItem("type_id")
      
      return initialState;
    }
  },
});

export const { setUser,setFirebaseUid, clearUser } = userSlice.actions;
export default userSlice.reducer;
