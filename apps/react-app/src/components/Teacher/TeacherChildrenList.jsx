import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherChildrenList = ({ onBack }) => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("You are not logged in. Please log in to view your children.");
        }

        const res = await axios.get(
          "https://youngeagles-api-server.up.railway.app/api/auth/children",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;
        setChildren(data.children || []);
      } catch (err) {
        if (err.response) {
          // Server responded but with a non-200 status
          if (err.response.status === 404) {
            setError("Children not found. Make sure you have registered any children.");
          } else if (err.response.status === 401) {
            setError("Unauthorized. Please log in again.");
          } else if (err.response.status === 403) {
            setError("Access denied. You must be a teacher to view this page.");
          } else {
            setError("An error occurred: " + err.response.data.message || "Unknown error.");
          }
        } else if (err.request) {
          // No response received
          setError("No response from server. Please check your internet connection.");
        } else {
          // Other errors
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);


  if (loading) return <p>Loading children...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md col-span-full">
      <h2 className="text-2xl font-bold mb-4">My Children</h2>
      {children.length === 0 ? (
        <p>No children found.</p>
      ) : (
        <ul className="space-y-2">
          {children.map((child) => (
            <li
              key={child.id}
              className="bg-blue-100 px-4 py-2 rounded-md text-blue-800 font-semibold"
            >
              {child.name} — Grade: {child.grade} — DOB: {child.dob}
            </li>
          ))}
        </ul>
      )}

      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        onClick={onBack}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default TeacherChildrenList;
