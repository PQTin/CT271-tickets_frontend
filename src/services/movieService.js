import axios from "axios";

const API_URL = "/api/movies";

const movieService = {
  // Lấy danh sách phim
  async getAllMovies() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi khi lấy danh sách phim";
    }
  },

  // Thêm phim mới
  async createMovie(formData, token) {
    try {
      const response = await axios.post(`${API_URL}/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi khi thêm phim";
    }
  },

  // Cập nhật phim
  async updateMovie(id, formData, token) {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi khi cập nhật phim";
    }
  },

  // Xóa phim
  async deleteMovie(id, token) {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi khi xóa phim";
    }
  },
};

export default movieService;
