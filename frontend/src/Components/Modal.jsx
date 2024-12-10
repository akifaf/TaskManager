import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { getTasks } from "../axios/ApiServers";
import { SOCKET } from "../constants/urls";

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  padding: '20px',
  zIndex: 1000,
  width: '400px',
  borderRadius: '8px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
};

const CLOSE_BUTTON_STYLES = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'none',
  border: 'none',
  fontSize: '16px',
  cursor: 'pointer'
};

function Modal({ username, userId, onClose }) {
  const [task, setTask] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [socket, setSocket] = useState(null);

  const getSocket = () => {
    if (userId) {
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const newSocket = new WebSocket(
        `${SOCKET}/tasks/${userId}`
      );
      setSocket(newSocket); 

      newSocket.onopen = () => {
        console.log("WebSocket Connected--", newSocket);

        // newSocket.send(JSON.stringify({
        //   'user'
        // }))
      };

      newSocket.onerror = (error) => {
        console.log("WebSocket error:", error);
      };

      newSocket.onclose = () => {
        console.log("WebSocket closed");
        setTimeout(getSocket, 1000); // Attempt to reconnect after 1 second
      };

      newSocket.onmessage = (event) => {
        var data = JSON.parse(event.data)
        if (!data.error) {
          setTask(data.payload);
          console.log(data.payload)
  
          const completedTasks = data.payload.filter((task) => task.is_completed);
          const pendingTasks = data.payload.filter((task) => !task.is_completed);
          
          setCompletedCount(completedTasks.length);
          setPendingCount(pendingTasks.length);
        }
        
        // const data = JSON.parse(event.data);
          // if (data.content) {
        //   console.log('data', data);
          
        //   // setMessages((prevMessages) => [...prevMessages, data]);
        // } else {
        //   console.log(data);
        //   console.log("Unexpected message format:", data);
        // }
      };
    }
  };

  // useEffect(() => {
  //   if (!userId) return;

  //   const fetchTask = async () => {
  //     const data = await getTasks(userId);
  //     if (!data.error) {
  //       setTask(data);

  //       const completedTasks = data.filter((task) => task.is_completed);
  //       const pendingTasks = data.filter((task) => !task.is_completed);
        
  //       setCompletedCount(completedTasks.length);
  //       setPendingCount(pendingTasks.length);
  //     }
  //   };

  //   fetchTask();
  // }, [userId]);


  useEffect(() => {
    if (socket) {
      socket.close();
    }
    getSocket();
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [userId]);

  return (
    <div style={MODAL_STYLES}>
      <button style={CLOSE_BUTTON_STYLES} onClick={onClose}>X</button>

      <div style={{ marginBottom: '20px', fontWeight: 'bold' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span className="flex w-3 h-3 me-3 bg-teal-500 rounded-full"></span>
          <span>Total Completed: {completedCount}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="flex w-3 h-3 me-3 bg-gray-500 rounded-full"></span>
          <span>Total Pending: {pendingCount}</span>
        </div>
      </div>

      <PieChart
        width={300}
        height={300}
        series={[
          {
            data: [
              { id: "Completed", value: completedCount },
              { id: "Pending", value: pendingCount },
            ],
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 5,
            cornerRadius: 5,
            startAngle: 0,
            endAngle: 360,
            cx: 150,
            cy: 150,
          },
        ]}
      />
      <p>Selected User ID: {username}</p>
    </div>
  );
}

export default Modal;
