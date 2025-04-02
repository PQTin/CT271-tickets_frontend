<template>
  <div class="login-container">
    <div v-if="!showRegister" class="card shadow-lg p-4 login-card">
      <div class="text-center mb-3">
        <h2 class="fw-bold text-primary">Đăng nhập</h2>
        <p class="text-muted">Chào mừng bạn quay lại!</p>
      </div>

      <AlertMessage v-if="errorMessage" :message="errorMessage" type="error" />
      <AlertMessage
        v-if="successMessage"
        :message="successMessage"
        type="success"
      />

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label fw-semibold">
            <i class="bi bi-person"></i> Tên đăng nhập
          </label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            placeholder="Nhập tên đăng nhập"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">
            <i class="bi bi-lock"></i> Mật khẩu
          </label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100">
          <i class="bi bi-box-arrow-in-right"></i> Đăng nhập
        </button>
      </form>

      <div class="text-center mt-3">
        <p class="mb-0">
          Chưa có tài khoản?
          <span
            @click="showRegister = true"
            class="text-primary fw-bold"
            style="cursor: pointer"
          >
            Đăng ký ngay
          </span>
        </p>
      </div>
    </div>

    <Register v-else @switchToLogin="showRegister = false" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "vue-router";
import AlertMessage from "@/components/AlertMessage.vue";
import Register from "./Register.vue";

const authStore = useAuthStore();
const router = useRouter();

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const showRegister = ref(false);

const handleLogin = async () => {
  try {
    errorMessage.value = "";
    successMessage.value = "";

    await authStore.login({
      username: username.value,
      password: password.value,
    });

    successMessage.value = "Đăng nhập thành công, đang xử lý...";

    setTimeout(() => {
      if (authStore.role === "admin") {
        router.push("/management");
      } else {
        router.push("/");
      }
    }, 2000);
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style scoped>
/* Định dạng toàn bộ màn hình */
.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
}

/* Định dạng thẻ card */
.login-card {
  width: 100%;
  background: #1e1e1e;
  border-radius: 10px;
  color: #ffffff;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.1);
}
/* Nút đăng nhập */
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004494;
}

.text-primary {
  color: #ffcc00 !important;
}

.text-muted {
  color: #aaaaaa !important;
}

.text-primary.fw-bold {
  color: #ff9900 !important;
}

.text-primary.fw-bold:hover {
  color: #ffcc00 !important;
}
</style>
