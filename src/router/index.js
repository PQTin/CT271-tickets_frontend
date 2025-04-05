import { createRouter, createWebHistory } from "vue-router";

import Management from "@/views/Management.vue";

import Home from "@/views/home/Home.vue";
import Auth from "@/views/home/auth.vue";
import MovieDetail from "@/views/home/movieDetail.vue";
import TicketsUser from "@/views/home/ticketsUser.vue";
import { useAuthStore } from "@/store/authStore";

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/Management",
    name: "Management",
    component: Management,
    meta: { requiresAdmin: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Auth,
  },
  {
    path: "/movie/:id",
    name: "MovieDetail",
    component: MovieDetail,
  },
  {
    path: "/tickets",
    name: "TicketsUser",
    component: TicketsUser,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard để kiểm tra quyền Admin
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const role = localStorage.getItem("role") || authStore.user?.role;

  if (to.meta.requiresAdmin && role !== "admin") {
    alert("Bạn không có quyền truy cập!");
    return next("/");
  }

  next();
});

export default router;
