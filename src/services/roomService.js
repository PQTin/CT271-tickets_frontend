import axios from "axios";

const API_URL = "/api/rooms";

const roomService = {
  // Lấy danh sách phòng
  getRooms: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi kết nối đến server";
    }
  },

  // Tạo phòng mới
  createRoom: async (roomData, token) => {
    try {
      const response = await axios.post(`${API_URL}/create`, roomData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi kết nối đến server";
    }
  },

  // Xóa phòng
  deleteRoom: async (roomId, token) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi kết nối đến server";
    }
  },
};

export default roomService;
