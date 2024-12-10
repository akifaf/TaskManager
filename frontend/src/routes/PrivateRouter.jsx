import React, { Children, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import { Route, Navigate, useNavigate } from "react-router-dom";
import Login from "../Components/Login";


const PrivateRouter = ({ children, ...rest }) => {

  const token = localStorage.getItem('authTokens');
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])
  
  
  if (token) {
    const authToken = JSON.parse(localStorage.getItem('authTokens'))
    const decoded = jwtDecode(authToken.access)
    if (decoded.is_admin){
    return <div>
      <Navigate to='admin-dashboard' />
    </div>
    } else {
      return <div>
      <Navigate to='user-dashboard' />
      </div>
    } 
  } 
  else {
    return <div>
      <Login />
    </div>
  }
    
}

export default PrivateRouter;