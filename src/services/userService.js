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
};

export default userService;
