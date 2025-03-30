import axios from "axios";

const API_URL = "/api/showtimes";

const ShowtimeService = {
  async getAllShowtimes() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async createShowtime(showtimeData, token) {
    try {
      const response = await axios.post(`${API_URL}/create`, showtimeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi kết nối đến server";
    }
  },

  async updateShowtime(id, showtimeData, token) {
    try {
      const response = await axios.put(
        `${API_URL}/update/${id}`,
        showtimeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi kết nối đến server";
    }
  },

  async deleteShowtime(id, token) {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi kết nối đến server";
    }
  },

  async getAvailableSeats(showtimeId) {
    try {
      const response = await axios.get(`${API_URL}/${showtimeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi kết nối đến server";
    }
  },
};

export default ShowtimeService;
