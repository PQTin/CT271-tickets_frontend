import { defineStore } from "pinia";
import userService from "@/services/userService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  }),

  actions: {
    async login(credentials) {
      try {
        const { token, role } = await userService.login(credentials);
        this.role = role;
        this.token = token;

        // Lưu thông tin đăng nhập vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
      } catch (error) {
        throw error;
      }
    },

    logout() {
      this.role = null;
      this.token = null;
      localStorage.removeItem("role");
      localStorage.removeItem("token");
    },
  },
});
