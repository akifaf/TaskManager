import { useEffect } from 'react';

function useTaskWebSocket(onTaskEvent) {
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/tasks/');

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onTaskEvent(data);  // Trigger the callback with received data
        };

        return () => {
            socket.close();
        };
    }, [onTaskEvent]);
}

export default useTaskWebSocket;
