// auth.js
import axios from "axios";

export async function teacherLogin(email, password) {
  try {
    const response = await axios.post(
      "https://youngeagles-api-server.up.railway.app/api/auth/teacher-login",
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    const token = response.data.token;

    // Basic decode function without external libs
    function parseJwt(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );

      return JSON.parse(jsonPayload);
    }

    const decodedToken = parseJwt(token);

    if (decodedToken.role !== "teacher") {
      throw new Error("You are not authorized to access this page.");
    }

    localStorage.setItem("accessToken", token);
    localStorage.setItem("teacher_id", decodedToken.id);
    localStorage.setItem("role", decodedToken.role);
    localStorage.setItem("user", JSON.stringify(decodedToken));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isTeacher", "true");

    return { success: true, user: decodedToken };
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Login failed";
    return { success: false, message };
  }
}
