
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"



const firebaseConfig = {
  apiKey: "AIzaSyDtk-2bJP83G4PgwQzk5uleCaZEJZV6sI8",
  authDomain: "airesumescore.firebaseapp.com",
  projectId: "airesumescore",
  storageBucket: "airesumescore.firebasestorage.app",
  messagingSenderId: "1062947834084",
  appId: "1:1062947834084:web:3f075b3269cbd63b1544f1",
  measurementId: "G-67KDTHMBGY"
};


const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const provider=new GoogleAuthProvider()
export {auth,provider};