// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7NioNltjw_OtEdUUn108viVdwXq31prk",
  authDomain: "pocket-pulse-1301c.firebaseapp.com",
  projectId: "pocket-pulse-1301c",
  storageBucket: "pocket-pulse-1301c.firebasestorage.app",
  messagingSenderId: "610086589985",
  appId: "1:610086589985:web:c0c693eee9af6cd2c8b560",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// db
export const firestore = getFirestore(app);
