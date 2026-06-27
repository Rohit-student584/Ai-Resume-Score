import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { api } from "../../utils/axios";
import { auth } from "../../utils/firebase";

export const Authcontext=createContext()
export const Authprovider=({children})=>{
const [user,setUser]=useState(null)
const [loading, setLoading] = useState(true);
const[history,setHistory]=useState([])
const[totalResume,setTotalResume]=useState("")
useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

        console.log("Firebase User:", firebaseUser);

        if (firebaseUser) {

            console.log("User Restored");

            const savedUser = localStorage.getItem("user");

            console.log("Saved User:", savedUser);

            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }

            const token = await firebaseUser.getIdToken(true);
            localStorage.setItem("token", token);

        } else {

            console.log("No Firebase User");

            setUser(null);

            localStorage.removeItem("user");
            localStorage.removeItem("token");

        }

        setLoading(false);

    });

    return () => unsubscribe();

}, []);
// console.log(user)
// const getHistory=async () => {
//     try {
//         if (!user) return;
//         const result=await api.get(`/resume/get/${user._id}`)
//         setHistory(result.data.resumes)
//     } catch (error) {
//         console.log(error)
//     }
// }

// useEffect(() => {
//    if(user){
//       getHistory();
//    }
// }, [user]);
return(
    <Authcontext.Provider value={{user,setUser,history,setHistory,loading,totalResume,setTotalResume}}>
        {children}
    </Authcontext.Provider>
)
}