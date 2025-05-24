import React, { useState, useEffect } from "react";

const mockChildren = [
  { id: 1, name: "Phenyo Lethlake" },
  { id: 2, name: "Jane Doe" },
  { id: 3, name: "Olivia Makunyane" },
  { id: 4, name: "John Satege" },
];

const TeacherAttendance = ({ onBack }) => {
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const initial = {};
    mockChildren.forEach(child => {
      initial[child.id] = "none"; // Default state
    });
    setAttendance(initial);
  }, []);

  const markAttendance = (childId, status) => {
    setAttendance(prev => ({
      ...prev,
      [childId]: status,
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-700 dark:text-white">
        Today's Attendance
      </h2>

      {mockChildren.map((child) => (
        <div
          key={child.id}
          className="flex items-center justify-between mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
        >
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {child.name}
          </span>
          <div className="flex gap-2">
            {["Present", "Absent", "Late"].map((status) => (
              <button
                key={status}
                onClick={() => markAttendance(child.id, status)}
                className={`px-3 py-1 rounded text-sm font-semibold 
                  ${attendance[child.id] === status
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={onBack}
        className="mt-6 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default TeacherAttendance;
