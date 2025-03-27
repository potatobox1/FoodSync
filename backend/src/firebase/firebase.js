// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration 
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdK9AoLeqSwIQl1vdtDV6SeqU8FBQP2Cs",
  authDomain: "foodsync-8fb63.firebaseapp.com",
  projectId: "foodsync-8fb63",
  storageBucket: "foodsync-8fb63.firebasestorage.app",
  messagingSenderId: "824968634559",
  appId: "1:824968634559:web:03e44ff0751fec28e0260a",
  measurementId: "G-K76KX2VGC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app);

const analytics = getAnalytics(app);
export {app , auth };