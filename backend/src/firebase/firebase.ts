import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDR6rs9JNAZGz71GRPdNuD7cDSkajai7GY",
  authDomain: "testingfoodsync.firebaseapp.com",
  projectId: "testingfoodsync",
  storageBucket: "testingfoodsync.firebasestorage.app",
  messagingSenderId: "824968634559",
  appId: "1:824968634559:web:03e44ff0751fec28e0260a",
  measurementId: "G-K76KX2VGC1"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const analytics: Analytics = getAnalytics(app);

export { app, auth, analytics };
