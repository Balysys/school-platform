import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "./components";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardParent from "./pages/DashboardParent";
import DashboardEnseignant from "./pages/DashboardEnseignant";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Check initial token
    const checkToken = () => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      
      if (storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split(".")[1]));
          setRole(payload.role);
        } catch (e) {
          console.error("Invalid token");
          localStorage.removeItem("token");
          setRole(null);
        }
      } else {
        setRole(null);
      }
    };

    checkToken();

    // Listen for custom auth event
    window.addEventListener("authTokenChanged", checkToken);
    
    return () => window.removeEventListener("authTokenChanged", checkToken);
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            token ? (
              role === "ADMIN" ? (
                <DashboardAdmin />
              ) : role === "ENSEIGNANT" ? (
                <DashboardEnseignant />
              ) : role === "PARENT" ? (
                <DashboardParent />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
