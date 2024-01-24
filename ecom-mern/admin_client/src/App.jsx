import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./layouts/navbar";
import SideNavbar from "./layouts/sideNavbar";

function App() {
  return (
    <>
      <div className="flex flex-col">
        <Navbar />

        <div className="flex">
          <SideNavbar />
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
