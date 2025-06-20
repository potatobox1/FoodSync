import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
  getAdditionalUserInfo,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async (): Promise<{ user: UserCredential; isNewUser: boolean }> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  const additionalInfo = getAdditionalUserInfo(result);
  const isNewUser = additionalInfo?.isNewUser ?? false;

  return { user: result, isNewUser };
};

export const doSignOut = async (): Promise<void> => {
  return auth.signOut();
};
