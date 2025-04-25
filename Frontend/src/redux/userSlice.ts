import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  firebase_uid: string;
  email: string;
  name: string;
  user_type: string 
  photoURL: string | null;
  user_id : string
  type_id : string    
}
const localUid = sessionStorage.getItem("firebase_uid") || "";
const localemail = sessionStorage.getItem("email") || "";
const localname = sessionStorage.getItem("name") || "";
const localtype = sessionStorage.getItem("user_type") || "";
const localurl = sessionStorage.getItem("photoURL") || null;
const localid = sessionStorage.getItem("user_id") || "";
const localtypeid = sessionStorage.getItem("type_id") || "";


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
      sessionStorage.setItem("firebase_uid", action.payload.firebase_uid);
      sessionStorage.setItem("email", action.payload.email );
      sessionStorage.setItem("name", action.payload.name );
      sessionStorage.setItem("user_type", action.payload.user_type );
      sessionStorage.setItem("photoURL", action.payload.photoURL?? "" );
      sessionStorage.setItem("user_id", action.payload.user_id );
      sessionStorage.setItem("type_id", action.payload.type_id );
      

      return { ...state, ...action.payload };
    },
    setFirebaseUid: (state, action: PayloadAction<{ firebase_uid: string, photoURL: string | null }>) => {
      sessionStorage.setItem("firebase_uid", action.payload.firebase_uid);
      sessionStorage.setItem("photoURL", action.payload.photoURL ?? "");
      
      state.firebase_uid = action.payload.firebase_uid;
      state.photoURL = action.payload.photoURL;

    },
    clearUser: () => {
      sessionStorage.removeItem("firebase_uid"); 
      sessionStorage.removeItem("email")
      sessionStorage.removeItem("name")
      sessionStorage.removeItem("user_type")
      sessionStorage.removeItem("photoURL")
      sessionStorage.removeItem("user_id")
      sessionStorage.removeItem("type_id")
      
      return initialState;
    }
  },
});

export const { setUser,setFirebaseUid, clearUser } = userSlice.actions;
export default userSlice.reducer;
