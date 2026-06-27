import { useContext } from "react"
import {  Analytics } from "./component/admin"
import { Dashboard } from "./component/dashboard"
import { History } from "./component/history"
import Login from "./component/login"
import { Logout } from "./component/logout"
import MainLayout from "./component/MainLayout"
import { Protected } from "./component/protected"
import Sidebar from "./component/sidebar"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Authcontext } from "./component/context/authcontext"
import { ResumeDetails } from "./component/ResumeDeatils"
import { Resumecompare } from "./component/ResumeCompare"

export const App=()=>{
  const{user}=useContext(Authcontext)
  console.log(user)
  const router=createBrowserRouter([
   {
    element:<MainLayout/>,
    children:[
      {
        path:"/",
        element:<Login/>
      },
       {
      path:"/dashboard",
      element:<Protected>
        <Dashboard/>
      </Protected>
    },
    {
      path:"/history",
      element:<Protected>
        <History/>
      </Protected>
    },
    {
      path:"/analytics",
      element:<Protected>
        <Analytics/>
      </Protected>
    },{
      path:"/logout",
      element:<Logout/>
    },
    {
      path:"/resume/:resumeId",
      element:<Protected>
        <ResumeDetails/>
      </Protected>
    },
    {
      path:"/resume/compare/:resumeId",
      element:<Protected>
        <Resumecompare/>
      </Protected>
    }
    ]
   } 
   
  ])
  return (
    <RouterProvider router={router}/>
  )
}