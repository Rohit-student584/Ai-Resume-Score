import { Outlet } from "react-router-dom";
import Sidebar from "../component/sidebar";
import "../App.css";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;