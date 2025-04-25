import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBdK9AoLeqSwIQl1vdtDV6SeqU8FBQP2Cs",
  authDomain: "foodsync-8fb63.firebaseapp.com",
  projectId: "foodsync-8fb63",
  storageBucket: "foodsync-8fb63.firebasestorage.app",
  messagingSenderId: "824968634559",
  appId: "1:824968634559:web:03e44ff0751fec28e0260a",
  measurementId: "G-K76KX2VGC1"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const analytics: Analytics = getAnalytics(app);

export { app, auth, analytics };
