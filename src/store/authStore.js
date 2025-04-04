import { defineStore } from "pinia";
import userService from "@/services/userService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    loading: false,
    error: null,
  }),
  getters: {
    isAdmin: (state) => state.role === "admin",
    userId: (state) => state.user?.user_id,
  },

  actions: {
    async login(credentials) {
      try {
        const { user, token, role } = await userService.login(credentials);
        this.user = user;
        this.role = role;
        this.token = token;

        // Lưu thông tin đăng nhập vào localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
      } catch (error) {
        throw error;
      }
    },

    logout() {
      this.role = null;
      this.token = null;
      this.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
    },
  },
});
