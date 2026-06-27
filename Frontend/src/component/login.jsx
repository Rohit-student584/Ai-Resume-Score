import "../App.css"
import { FcGoogle } from "react-icons/fc";
import { FaKey } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useContext } from "react";
import { Authcontext } from "./context/authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../utils/axios";
import { useEffect } from "react";

const Login = () => {
    const{user,setUser}=useContext(Authcontext)
    const navigate=useNavigate()
    useEffect(() => {

    if (user) {
        navigate("/dashboard", { replace: true });
    }

}, [user, navigate]);
    const handleLogin=async()=>{
        try {
            const result=await signInWithPopup(auth,provider)
            const token = await result.user.getIdToken();
        // console.log(result.user.displayName)
        const userInfo={
            name:result.user.displayName,
            email:result.user.email,
            photoUrl:result.user.photoURL,
            firebaseUid: result.user.uid
        }
        const response=await api.post("/auth/register",userInfo)
        localStorage.setItem("token", token);
        localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);
        setUser(response.data.user);
        navigate("/dashboard")
        
        } catch (error) {
             console.log(error);
   console.log(error.response);
   console.log(error.response?.data);
        }
    }
    
  return (
    <div className="login-page">

      {/* Background Blur */}

      <div className="login-overlay"></div>

      {/* Login Card */}

      <div className="login-card">

        <div className="login-header">

          <h1>Login</h1>

          <FaKey className="key-icon" />

        </div>

        <button className="google-btn" onClick={handleLogin}>

          <FcGoogle />

          <span>Sign in with Google</span>

        </button>

      </div>

    </div>
  );
};

export default Login;