// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBizEi4z8u39e4IYHLa8oVwnkQW3Q1sJLg",
  authDomain: "twitter-4aeb2.firebaseapp.com",
  projectId: "twitter-4aeb2",
  storageBucket: "twitter-4aeb2.firebasestorage.app",
  messagingSenderId: "207383039271",
  appId: "1:207383039271:web:7d537ab4051a53c0872d02",
  measurementId: "G-1YGPBHDXP0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app)
// const analytics = getAnalytics(app);