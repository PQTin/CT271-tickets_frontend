import axios from "axios";

const API_URL = "/api/users";

const userService = {
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
  },

  async getCurrentUser(token) {
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
  },

  async updateCurrentUser(userData, token) {
    try {
      const response = await axios.put(`${API_URL}/update`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
  },

  async adminRegister(adminData, token) {
    try {
      const response = await axios.post(`${API_URL}/adminRegister`, adminData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
  },

  async getUsersByRole(role, token) {
    try {
      const response = await axios.get(`${API_URL}/role/${role}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
  },

  async updateUser(userId, userData, token) {
    try {
      const response = await axios.put(
        `${API_URL}/update/${userId}`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
  },

  async deleteUser(userId, token) {
    try {
      const response = await axios.delete(`${API_URL}/delete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
  },
};

export default userService;
