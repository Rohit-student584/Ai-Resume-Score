import { useContext } from "react"
import { Authcontext } from "./context/authcontext"
import { Navigate } from "react-router-dom";

export const Protected=({children})=>{
const { user, loading } = useContext(Authcontext);
if (loading) {
   return <div>Loading...</div>;
}
console.log("Protected User:", user);
if (!user) {
    return <Navigate to={"/"}/>
}
return children;
}