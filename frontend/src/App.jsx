import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./Components/Login";
import Register from "./Components/Register";
import Task from "./Components/Task";
import PrivateRouter from "./routes/PrivateRouter"
import AdminDashboard from "./Components/AdminDashboard";
import { jwtDecode } from "jwt-decode";

function App() {
  const token = window.localStorage.getItem("authTokens");
  const authToken = token ? JSON.parse(token) : null;

  const [userType, setUserType] = useState(null);

  useEffect(() => {
    if (authToken) {
      const decoded = jwtDecode(authToken.access);
      setUserType(decoded.is_admin ? "admin" : "user");
    }
  }, [authToken]);

  const isLoggedIn = !!authToken;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<Task />} />


        <Route path="/" element={<PrivateRouter />} />
      </Routes>
    </Router>
  );
}

export default App;
