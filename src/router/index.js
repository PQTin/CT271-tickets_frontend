import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Management from "@/views/Management.vue";
import { useAuthStore } from "@/store/authStore";

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/Management",
    name: "Management",
    component: Management,
    meta: { requiresAdmin: true },
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
