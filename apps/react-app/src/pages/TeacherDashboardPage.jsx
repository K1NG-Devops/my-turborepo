import React from "react";
import TeacherDashboard from "./TeacherDashboard";

const TeacherDashboardPage = () => {
  const storedUser = localStorage.getItem("user");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : {};

  return <TeacherDashboard user={loggedInUser} />;
};

export default TeacherDashboardPage;
