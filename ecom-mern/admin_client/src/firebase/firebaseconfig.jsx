import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDMAomqDRXHyJBsnQRMKUVbAzHaFeR5Iig",
  authDomain: "ecom-mern-auth.firebaseapp.com",
  projectId: "ecom-mern-auth",
  storageBucket: "ecom-mern-auth.appspot.com",
  messagingSenderId: "882258689520",
  appId: "1:882258689520:web:8edef26548d36c671e7135",
  measurementId: "G-QQXH35YSRP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);