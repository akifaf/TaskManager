import React, { useState } from "react";
import delete_icon from "../assets/delete.png";
import tick from "../assets/tick.png";
import untick from "../assets/not_tick.png";

function TaskItems({ task, onUpdate, onDelete, onComplete, onInComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState(task.title);

  const handleUpdate = () => {
    if (updatedTask.trim() === "") return;
    onUpdate(task.id, updatedTask);
    setIsEditing(false);
  };

  return (
    <div className="overflow-x-auto flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-3 shadow-md">
      <div className="flex items-center gap-3">
        <button onClick={() => (task.is_completed ? onInComplete(task.id) : onComplete(task.id))}>
          <img
            className="w-6 h-6" 
            src={task.is_completed ? tick : untick}
            alt={task.is_completed ? "Completed" : "Not completed"}
          />
        </button>

        {isEditing ? (
          <input
            value={updatedTask}
            onChange={(e) => setUpdatedTask(e.target.value)}
            className="flex-1 border-b border-gray-400 p-1 focus:border-blue-400 outline-none"
          />
        ) : (
          <span className={`text-lg ${task.is_completed ? "line-through text-gray-500" : ""}`}>
            {task.title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isEditing ? (
          <button onClick={handleUpdate} className="text-blue-600 hover:underline">
            Save
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:underline">
            Edit
          </button>
        )}
        <button onClick={() => onDelete(task.id)}>
          <img
            className="w-5 h-5 cursor-pointer"
            src={delete_icon}
            alt="Delete"
          />
        </button>
      </div>
    </div>
  );
}

export default TaskItems;
