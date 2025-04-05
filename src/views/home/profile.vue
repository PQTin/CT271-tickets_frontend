<template>
  <Header />
  <div class="container">
    <div
      class="card p-4 shadow-lg"
      style="background-color: #1c1c1c; color: white"
    >
      <h3 class="mb-4">Thông Tin Người Dùng</h3>
      <form @submit.prevent="handleSubmit">
        <!-- Gom Username và Mật khẩu cùng 1 hàng -->
        <div class="mb-3 d-flex">
          <div class="me-3" style="flex: 1">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="username"
              v-model="user.username"
            />
          </div>
          <div style="flex: 1">
            <label for="password" class="form-label">Mật khẩu</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="password"
              placeholder="Nhập mật khẩu mới nếu muốn thay đổi"
            />
          </div>
        </div>

        <!-- Gom Email và Số điện thoại cùng 1 hàng -->
        <div class="mb-3 d-flex">
          <div class="me-3" style="flex: 1">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="user.email"
            />
          </div>
          <div style="flex: 1">
            <label for="phone" class="form-label">Số điện thoại</label>
            <input
              type="text"
              class="form-control"
              id="phone"
              v-model="user.phone"
            />
          </div>
        </div>

        <!-- Ảnh đại diện -->
        <div class="mb-3">
          <label for="avatar" class="form-label">Ảnh đại diện</label>
          <img
            :src="`http://localhost:5000${user.avatar_url}`"
            alt="Avatar"
            class="img-fluid mb-2"
            width="100"
          />
          <input
            type="file"
            class="form-control"
            id="avatar"
            @change="handleAvatarChange"
          />
        </div>

        <!-- Vai trò -->
        <div class="mb-3">
          <label for="role" class="form-label">Vai trò</label>
          <input
            type="text"
            class="form-control"
            id="role"
            v-model="user.role"
            disabled
          />
        </div>

        <button type="submit" class="btn btn-primary">Cập nhật</button>
      </form>
    </div>
  </div>
  <Footer />
</template>

<script>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/store/authStore";
import userService from "@/services/userService";
import Header from "@/components/home/header.vue";
import Footer from "@/components/home/footer.vue";
export default {
  components: {
    Header,
    Footer,
  },
  setup() {
    const toast = useToast();
    const authStore = useAuthStore();
    const user = ref({
      username: "",
      email: "",
      phone: "",
      avatar_url: "",
      role: "",
    });
    const password = ref("");
    const token = authStore.token;

    const fetchUserData = async () => {
      try {
        const data = await userService.getCurrentUser(token);
        user.value = data.user;
      } catch (error) {
        toast.error(error.message || "Không thể tải thông tin người dùng.");
      }
    };

    const handleSubmit = async () => {
      try {
        const updatedUser = new FormData();
        // Thêm dữ liệu người dùng vào FormData
        updatedUser.append("username", user.value.username);
        updatedUser.append("email", user.value.email);
        updatedUser.append("phone", user.value.phone);

        // Nếu có mật khẩu, thêm vào FormData
        if (password.value) {
          updatedUser.append("password", password.value);
        }

        // Nếu có ảnh đại diện mới, thêm vào FormData
        if (user.value.avatar) {
          updatedUser.append("avatar", user.value.avatar);
        }
        await userService.updateCurrentUser(updatedUser, token);
        toast.success("Cập nhật thông tin thành công!");
        await fetchUserData();
        // Cập nhật lại chỉ username và avatar_url trong localStorage
        const storedUser = JSON.parse(localStorage.getItem("user")); // Lấy dữ liệu user cũ từ localStorage
        const updatedUserInfo = {
          user_id: storedUser.user_id,
          username: user.value.username,
          avatar_url: user.value.avatar_url,
        };

        localStorage.setItem("user", JSON.stringify(updatedUserInfo));
      } catch (error) {
        toast.error(error.message || "Cập nhật không thành công.");
      }
    };

    // Xử lý khi thay đổi ảnh đại diện
    const handleAvatarChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        user.value.avatar = file; // Lưu trữ file vào đối tượng người dùng
      }
    };
    onMounted(fetchUserData);

    return {
      user,
      password,
      handleSubmit,
      handleAvatarChange,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin-top: 100px;
  display: block;
}
.card {
  background-color: #2f2f2f;
}
.form-label {
  color: white;
}
.btn-primary {
  background-color: #007bff;
}
</style>
