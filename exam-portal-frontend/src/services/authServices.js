import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api"; 


const register = async (user) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/register`, user);

    if (data && data.userId) {
      console.log("✅ User registered:", data.username);
      return { isRegistered: true, user: data, error: null };
    } else {
      console.error("❌ Registration failed:", data);
      return { isRegistered: false, error: data };
    }
  } catch (error) {
    console.error("❌ authService.register() Error:", error.message);
    return { isRegistered: false, error: error.message };
  }
};

// ---------- LOGIN ----------
const login = async (username, password) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password,
    });

    // Assuming backend returns user details (not JWT)
    if (data && data.userId) {
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("isLoggedIn", "true");

      console.log("✅ Login successful:", data.username);
      return { success: true, user: data };
    } else {
      console.error("❌ Login failed:", data);
      return { success: false, error: "Invalid credentials" };
    }
  } catch (error) {
    console.error("❌ authService.login() Error:", error.message);
    return { success: false, error: error.message };
  }
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("isLoggedIn");
  console.log("👋 Logged out successfully");
};

const authServices = { register, login, logout };
export default authServices;
