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
  async getShowtimesByToday() {
    try {
      const response = (await axios.get(API_URL)).data;
      if (!response.data || response.data.length === 0) {
        return { success: false, message: "Không có suất chiếu nào." };
      }

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0]; // Lấy YYYY-MM-DD

      // Lọc danh sách suất chiếu cho hôm nay
      const filteredShowtimes = response.data.filter((showtime) => {
        const startTime = new Date(showtime.start_time);
        const showtimeDateStr = startTime.toISOString().split("T")[0];
        return showtimeDateStr === todayStr;
      });

      return { success: true, data: filteredShowtimes };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  async getShowtimesByWeek() {
    try {
      const response = (await axios.get(API_URL)).data;
      if (!response.data || response.data.length === 0) {
        return { success: false, message: "Không có suất chiếu nào." };
      }

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0]; // Lấy YYYY-MM-DD

      const next7Days = new Date();
      next7Days.setDate(today.getDate() + 7);
      const next7DaysStr = next7Days.toISOString().split("T")[0]; // Lấy YYYY-MM-DD

      // Lọc danh sách suất chiếu trong khoảng từ hôm nay đến 7 ngày tới
      const filteredShowtimes = response.data.filter((showtime) => {
        const startTime = new Date(showtime.start_time);
        const showtimeDateStr = startTime.toISOString().split("T")[0]; // Lấy YYYY-MM-DD
        return showtimeDateStr >= todayStr && showtimeDateStr <= next7DaysStr;
      });

      return { success: true, data: filteredShowtimes };
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
