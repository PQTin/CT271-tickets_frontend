<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3 py-3">
    <div class="container-fluid">
      <span class="navbar-brand fw-bold" @click="navigateTo('/')">
        Ticket Movie
      </span>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <span class="nav-link" @click="navigateTo('/')">Trang chủ</span>
          </li>
          <li class="nav-item">
            <span class="nav-link" @click="navigateTo('/showtimes')"
              >Suất chiếu</span
            >
          </li>
          <li class="nav-item">
            <span class="nav-link" @click="navigateTo('/movies')"
              >Danh sách phim</span
            >
          </li>
          <li v-if="authStore.user?.username" class="nav-item">
            <span class="nav-link" @click="navigateTo('/tickets')"
              >Danh sách vé đã mua</span
            >
          </li>
        </ul>

        <div class="d-flex align-items-center">
          <button
            v-if="!authStore.user?.username"
            class="btn btn-primary"
            @click="navigateTo('/login')"
          >
            Đăng nhập
          </button>

          <div v-else class="dropdown">
            <!-- Lấy avatar từ authStore.user -->
            <img
              :src="getAvatarUrl"
              alt="Avatar"
              class="avatar dropdown-toggle"
              data-bs-toggle="dropdown"
            />
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <span class="dropdown-item" @click="navigateTo('/profile')"
                  >Chỉnh sửa thông tin</span
                >
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <span class="dropdown-item" @click="logout">Đăng xuất</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { computed } from "vue";

const authStore = useAuthStore();
const router = useRouter();

const getAvatarUrl = computed(() => {
  const user = authStore.user;
  return user?.avatar_url
    ? `http://localhost:5000${user.avatar_url}`
    : "/default-avatar.png";
});

const navigateTo = (path) => {
  router.push(path);
};

const logout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<style scoped>
.navbar {
  background-color: #121212;
  height: 80px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}

.navbar-brand {
  color: #ffd700;
  cursor: pointer;
  font-size: 1.6rem;
}

.nav-link {
  color: #ffd700;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 10px 15px;
}

.nav-link:hover {
  color: #ff6347;
}

.btn-primary {
  background-color: #007bff;
  border-color: #0056b3;
  font-size: 1.1rem;
  padding: 8px 16px;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
}

.dropdown-menu {
  background-color: #f4f4f4; /* Màu nền sáng cho dropdown */
}

.dropdown-item:hover {
  background-color: #ddd; /* Màu sáng khi hover */
}
</style>
