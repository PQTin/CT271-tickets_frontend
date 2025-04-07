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
  async getUpcomingShowtimes() {
    try {
      const response = (await axios.get(API_URL)).data;
      if (!response.data || response.data.length === 0) {
        return { success: false, message: "Không có suất chiếu nào." };
      }

      const now = new Date();

      // Lọc các suất chiếu mà thời gian kết thúc vẫn còn ở tương lai
      const upcomingShowtimes = response.data.filter((showtime) => {
        const endTime = new Date(showtime.end_time);
        return endTime > now;
      });

      return { success: true, data: upcomingShowtimes };
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
        const endTime = new Date(showtime.end_time);
        const showtimeDateStr = startTime.toISOString().split("T")[0];
        return showtimeDateStr === todayStr && endTime > today;
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

      const now = new Date();
      const next7Days = new Date();
      next7Days.setDate(now.getDate() + 7);

      // Lọc các suất chiếu có thời gian kết thúc lớn hơn giờ hiện tại và thời gian bắt đầu nhỏ hơn hoặc bằng thời gian hiện tại cộng 7 ngày
      const filteredShowtimes = response.data.filter((showtime) => {
        const endTime = new Date(showtime.end_time);
        const startTime = new Date(showtime.start_time);
        return endTime > now && startTime <= next7Days;
      });

      return { success: true, data: filteredShowtimes };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  // Lấy danh sách ghế trống cho suất chiếu
  async getSeats(showtimeId) {
    try {
      const response = await axios.get(`${API_URL}/seat/${showtimeId}`);
      return response.data; // Trả về dữ liệu ghế trống
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
};

export default ShowtimeService;
