import React, { useState, useEffect } from "react";
import task from "../assets/task.png";
import TaskItems from "./TaskItems";
import Layout from "./Layout";
import { AddTask, getTasks, updateTask, deleteTask, markTaskComplete, markTaskInComplete } from '../axios/ApiServers';
import {jwtDecode} from "jwt-decode";
import Swal from 'sweetalert2';
import { Navigate } from "react-router-dom";

function Task() {
  const [taskList, setTaskList] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [userId, setUserId] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true); // New state for authentication
  const [userType, setUserType] = useState(null); // Initial state set to null


  useEffect(() => {
    const authToken = JSON.parse(localStorage.getItem('authTokens'));
    if (authToken) {
      const decoded = jwtDecode(authToken.access);
      setUserId(decoded.user_id);
      setUserType(decoded.is_admin ? "admin" : "user");


      const fetchTasks = async () => {
        const tasks = await getTasks(decoded.user_id);
        if (!tasks.error) {
          setTaskList(tasks);
        }
      };

      fetchTasks();
    } else {
      setIsAuthenticated(false); // Set to false if no token found
    }
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;
    const addedTask = await AddTask(userId, { user: userId, title: newTask });
    if (!addedTask.error) {
      Swal.fire({
        title: "Task Added",
        icon: "success",
        toast: true,
        timer: 6000,
        position: "top",
      });
      setTaskList([...taskList, addedTask]);
      setNewTask("");
    } else {
      Swal.fire({ title: addedTask.error, icon: "error" });
    }
  };

  const handleUpdateTask = async (id, updatedTitle) => {
    const updatedTask = await updateTask(userId, id, { user: userId, title: updatedTitle });
    if (!updatedTask.error) {
      setTaskList(taskList.map((task) => (task.id === id ? updatedTask : task)));
    }
  };

  const handleDeleteTask = async (id) => {
    const response = await deleteTask(userId, id);
    if (!response.error) {
      setTaskList(taskList.filter((task) => task.id !== id));
      Swal.fire({
        title: "Task deleted",
        icon: "success",
        toast: true,
        timer: 2000,
      });
    }
  };

  const handleComplete = async (id) => {
    const response = await markTaskComplete(userId, id);
    if (!response.error) {
      setTaskList((prevTaskList) =>
        prevTaskList.map((task) => (task.id === id ? { ...task, is_completed: true } : task))
      );
      Swal.fire({
        title: "Task updated",
        icon: "success",
        toast: true,
        timer: 2000,
        position: "top",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: response.error,
        icon: "error",
        timer: 2000,
      });
    }
  };

  const handleInComplete = async (id) => {
    const response = await markTaskInComplete(userId, id);
    if (!response.error) {
      setTaskList((prevTaskList) =>
        prevTaskList.map((task) => (task.id === id ? { ...task, is_completed: false } : task))
      );
      Swal.fire({
        title: "Task updated",
        icon: "success",
        toast: true,
        timer: 2000,
        position: "top",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: response.error,
        icon: "error",
        timer: 2000,
      });
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white outline outline-1 w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl">
          {/* Title */}
          <div className="flex items-center mt-7px gap-2">
            <img className="w-8" src={task} alt="" />
            <h1 className="text-3xl font-semibold">Task List</h1>
          </div>

          {/* Input */}
          <div className="flex items-center my-7 bg-gray-200 rounded-full">
            <input
              className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600"
              type="text"
              placeholder="Add your task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button
              className="border-none rounded-full bg-orange-600 w-32 h-14 text-white text-lg font-medium cursor-pointer"
              onClick={handleAddTask}
            >
              Add +
            </button>
          </div>

          {/* Task List */}
          <div>
            {taskList.map((task) => (
              <TaskItems
                key={task.id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                onComplete={handleComplete}
                onInComplete={handleInComplete}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Task;
