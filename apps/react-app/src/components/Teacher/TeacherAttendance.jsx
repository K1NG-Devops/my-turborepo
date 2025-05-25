import React, { useState, useEffect } from "react";
import axios from "axios";
import { decodeToken } from "../../utils/decodeToken";

const mockChildren = [
  { id: 1, name: "Phenyo Lethlake" },
  { id: 2, name: "Jane Doe" },
  { id: 3, name: "Olivia Makunyane" },
  { id: 4, name: "John Satege" },
];

const TeacherAttendance = ({ onBack }) => {
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.id) {
        setTeacherId(decoded.id);
      } else {
        console.warn("No teacher id found in token");
      }
    } else {
      alert("You must be logged in");
    }

    const initialAttendance = {};
    mockChildren.forEach((child) => {
      initialAttendance[child.id] = { status: "none", late: false };
    });
    setAttendance(initialAttendance);
  }, []);

  const markAttendance = (childId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        status,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!teacherId) {
      console.error("Teacher ID is missing");
      alert("Unable to submit: Teacher ID not found.");
      return;
    }

    setIsSubmitting(true);

    try {
      const records = [];

      for (const child of mockChildren) {
        const record = attendance[child.id];
        const { status, late } = record || {};
        if (status && status !== "none") {
          records.push({
            teacherId,
            childId: child.id,
            date,
            status: status.toLowerCase(),
            late: !!late,
          });
        }
      }

      if (records.length === 0) {
        alert("Please mark attendance for at least one child.");
        setIsSubmitting(false);
        return;
      }

      await axios.post(
        "http://localhost:3000/api/attendance/mark-attendance",
        records,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Attendance submitted successfully.");
    } catch (error) {
      console.error("Error submitting attendance:", error.response?.data || error.message);
      alert("Failed to submit attendance. See console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-700 dark:text-white">
        Today's Attendance
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>

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
                className={`px-3 py-1 rounded text-sm font-semibold ${
                  attendance[child.id]?.status === status
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

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Dashboard
        </button>
        <button
          disabled={isSubmitting}
          onClick={handleSubmit}
          className={`px-4 py-2 text-white rounded ${
            isSubmitting ? "bg-gray-500" : "bg-purple-700 hover:bg-purple-800"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Attendance"}
        </button>
      </div>
    </div>
  );
};

export default TeacherAttendance;
