import axios from "axios";
import { API_BASE_URL } from "../constants/urls";
import apiInstance from "./axios";
import { axiosInstance } from "./AxiosInstance";

export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}token/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("No active account found with the given credentials");
    }
    const data = await response.json();
    localStorage.setItem("authTokens", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Login error:", error.message);
    return null;
  }
};

export const register = async (userData) => {
    try {
        const response = await apiInstance.post('register/', userData);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return{
        error: error.response ? error.response.data : 'Something went wrong'
        }
    }
}

export const logoutUser = async () => {
    localStorage.removeItem('authTokens')
    navigate('/login')
}

// Token refresh function
export const refreshauthToken = async () => {
  const tokens = JSON.parse(localStorage.getItem("authTokens"));
  if (!tokens || !tokens.refresh) {
    console.log("No refresh token available");
    return null;
  }

  const refreshToken = tokens.refresh;

  try {
    const response = await axios.post(`${API_BASE_URL}token/refresh/`, {
      refresh: refreshToken,
    });
    if (response.status === 200) {
      localStorage.setItem("authTokens", JSON.stringify(response.data));
      return response;
    }
  } catch (error) {
    console.log("Failed to refresh token:", error);
  }

  return null;
};

// Add a new task
export const AddTask = async (user_id, data) => {
    try {
      const response = await axiosInstance.post(`/${user_id}/`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        error: error.response ? error.response.data : 'Something went wrong',
      };
    }
  };
  
  // Fetch all tasks
  export const  getTasks = async (user_id) => {
    try {
      const response = await axiosInstance.get(`/${user_id}/`);
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        error: error.response ? error.response.data : 'Something went wrong',
      };
    }
  };
  
  // Update a task
  export const updateTask = async (user_id, id, data) => {
    try {
      const response = await axiosInstance.put(`task-detail/${user_id}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        error: error.response ? error.response.data : 'Something went wrong',
      };
    }
  };
  
  // Delete a task
  export const deleteTask = async (user_id, task_id) => {
    try {
      const response = await axiosInstance.delete(`task-detail/${user_id}/${task_id}/`);
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        error: error.response ? error.response.data : 'Something went wrong',
      };
    }
  };
  
// Mark Task completed
export const markTaskComplete = async (user_id, task_id) => {
  try {
    const response = await axiosInstance.patch(`task-mark-as-completed/${user_id}/${task_id}/`);
    return response.data;
  } catch (error) {
    console.log(error);
    return {
      error: error.response ? error.response.data : 'Something went wrong',
    };
  }
}
  
// Mark Task completed
export const markTaskInComplete = async (user_id, task_id) => {
  try {
    const response = await axiosInstance.patch(`task-mark-as-incompleted/${user_id}/${task_id}/`);
    return response.data;
  } catch (error) {
    console.log(error);
    return {
      error: error.response ? error.response.data : 'Something went wrong',
    };
  }
}

// user list


export const userList = async () => {
  try {
    const response = await axiosInstance.get('user-list');
    return response.data
  } catch (error) {
    return {
      error: error.response ? error.response.data : 'Something went wrong',
    }
  }
}