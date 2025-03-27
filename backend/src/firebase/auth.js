import { auth } from "./firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";



export const doCreateUserWithEmailAndPassword = async (EmailAuthCredential, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};


export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    //result.user -> can save to firestore idek what that is
    return result;

};

export const doSignOut = () => {

    return auth.signOut();

}


// TODO: Import Firebase dependencies
// import { initializeApp } from 'firebase/app';
// import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// TODO: Add your Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
// };

// TODO: Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// TODO: Implement Google sign-in function
// export const signInWithGoogle = async () => {
//   try {
//     const provider = new GoogleAuthProvider();
//     const result = await signInWithPopup(auth, provider);
//     // Handle successful sign-in
//     return result.user;
//   } catch (error) {
//     // Handle sign-in errors
//     console.error('Error signing in with Google:', error);
//     throw error;
//   }
// };

// TODO: Implement sign-out function
// export const signOut = async () => {
//   try {
//     await auth.signOut();
//     // Handle successful sign-out
//   } catch (error) {
//     // Handle sign-out errors
//     console.error('Error signing out:', error);
//     throw error;
//   }
// };

// TODO: Implement auth state listener
// export const onAuthStateChanged = (callback) => {
//   return auth.onAuthStateChanged(callback);
// };

