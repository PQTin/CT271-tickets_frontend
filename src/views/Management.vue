<template>
  <div class="d-flex vh-100">
    <!-- Sidebar -->
    <div class="sidebar bg-dark text-white d-flex flex-column">
      <!-- Logo -->
      <div class="text-center my-3">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
      </div>

      <!-- Chức năng -->
      <h5 class="text-center">Chức năng</h5>
      <ul class="nav flex-column flex-grow-1">
        <li class="nav-item">
          <a
            href="#"
            class="nav-link text-white"
            @click="activeComponent = 'RoomManagement'"
            >Quản lý phòng</a
          >
        </li>
        <li class="nav-item">
          <a
            href="#"
            class="nav-link text-white"
            @click="activeComponent = 'MovieManagement'"
            >Quản lý kho phim</a
          >
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link text-white">Quản lý suất chiếu</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link text-white">Quản lý vé</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link text-white">Quản lý tài khoản</a>
        </li>
      </ul>

      <!-- Nút đăng xuất -->
      <button class="btn btn-danger w-100 mt-auto p-2" @click="logout">
        Đăng xuất
      </button>
    </div>

    <!-- Main Content -->
    <div class="main-content d-flex flex-column flex-grow-1">
      <!-- Header -->
      <div class="header bg-dark text-white p-3">
        <h4 class="m-0">HỆ THỐNG QUẢN LÝ RẠP CHIẾU PHIM</h4>
      </div>

      <!-- Nội dung hiển thị -->
      <div class="content-area flex-grow-1 overflow-auto p-4">
        <RoomManagement v-if="activeComponent === 'RoomManagement'" />
        <MovieManagement v-if="activeComponent === 'MovieManagement'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import RoomManagement from "@/components/room/roomManagement.vue";
import MovieManagement from "@/components/movie/movieManagement.vue";
import { useAuthStore } from "@/store/authStore";
const activeComponent = ref("RoomManagement");
const authStore = useAuthStore();
const router = useRouter();

// Xử lý đăng xuất
const logout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<style scoped>
/* Sidebar */
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.sidebar .nav-link {
  padding: 12px;
  display: block;
  cursor: pointer;
  transition: background 0.3s;
}

.sidebar .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Logo */
.logo {
  width: 80px;
  height: auto;
}

/* Main Content */
.main-content {
  width: 100%;
  min-width: 750px;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 250px;
  right: 0;
  z-index: 1000;
  text-align: center;
}

/* Nội dung có thanh cuộn riêng */
.content-area {
  margin-top: 56px;
  height: calc(100vh - 56px);
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.2);
}

/* Nút đăng xuất */
.btn-danger {
  font-size: 16px;
  font-weight: bold;
}
</style>
