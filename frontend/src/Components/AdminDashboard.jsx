import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { userList } from "../axios/ApiServers";
import Modal from "./Modal"; 
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userType, setUserType] = useState(null); // Initial state set to null
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const token = window.localStorage.getItem("authTokens");
    const authToken = token ? JSON.parse(token) : null;

    if (authToken) {
      const decoded = jwtDecode(authToken.access);
      setUserType(decoded.is_admin ? "admin" : "user");
    }
    setLoading(false); // Set loading to false after setting userType
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userList();
        setUsers(response); // Assuming user data is in response
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator until userType is set
  }

  if (userType !== "admin") {
    return <Navigate to="/user-dashboard" />;
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white outline outline-1 w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl">
          {/* Title */}
          <div className="flex items-center mb-6 gap-2">
            <h1 className="text-3xl font-semibold">Users</h1>
          </div>

          {users.length > 0 ? (
            users.map((user) => (
              <button
                onClick={() => setSelectedUser(user)}
                key={user.id}
                className="overflow-x-auto items-center justify-between bg-gray-100 p-4 rounded-lg mb-3 shadow-md"
              >
                <div className="flex items-center gap-3 cursor-pointer">
                  <span>{user.first_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{user.email}</span>
                </div>
              </button>
            ))
          ) : (
            <div>Empty users</div>
          )}

          {/* Modal for selected user */}
          {selectedUser && (
            <Modal
              username={selectedUser.username}
              userId={selectedUser.id}
              onClose={() => setSelectedUser(null)}
            >
              Hello world
            </Modal>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
