// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbZ81PXTIY5fVAFuHZu9SZRsMCtGjciuI",
    authDomain: "chat-app-final-62833.firebaseapp.com",
    projectId: "chat-app-final-62833",
    storageBucket: "chat-app-final-62833.appspot.com",
    messagingSenderId: "368866559311",
    appId: "1:368866559311:web:32aa4c54459ab046d1713a"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
