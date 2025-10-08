import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAY6F7CoUVYx9aQYTD9gZw_nHKOjEsc-5E",
  authDomain: "video-28f68.firebaseapp.com",
  projectId: "video-28f68",
  storageBucket: "video-28f68.firebasestorage.app",
  messagingSenderId: "304835515773",
  appId: "1:304835515773:web:28440fa2c6e906cede6814"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const provider = new GoogleAuthProvider();

export default app;