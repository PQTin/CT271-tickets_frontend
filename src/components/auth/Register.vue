<template>
  <div class="login-container">
    <div class="card shadow-lg p-4 login-card">
      <div class="text-center mb-3">
        <h2 class="fw-bold text-primary">Đăng ký</h2>
        <p class="text-muted">Tạo tài khoản mới để tiếp tục</p>
      </div>

      <AlertMessage
        :message="alertMessage"
        :type="alertType"
        v-if="alertMessage"
      />

      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label class="form-label fw-semibold">
            <i class="bi bi-person"></i> Tên đăng nhập
          </label>
          <input
            v-model="user.username"
            type="text"
            class="form-control"
            placeholder="Nhập tên đăng nhập"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">
            <i class="bi bi-envelope"></i> Email
          </label>
          <input
            v-model="user.email"
            type="email"
            class="form-control"
            placeholder="Nhập email"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">
            <i class="bi bi-telephone"></i> Số điện thoại
          </label>
          <input
            v-model="user.phone"
            type="text"
            class="form-control"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">
            <i class="bi bi-lock"></i> Mật khẩu
          </label>
          <input
            v-model="user.password"
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100">
          <i class="bi bi-person-plus"></i> Đăng ký
        </button>
      </form>

      <div class="text-center mt-3">
        <p class="mb-0">
          Đã có tài khoản?
          <span
            @click="$emit('switchToLogin')"
            class="text-primary fw-bold"
            style="cursor: pointer"
          >
            Đăng nhập ngay
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import userService from "@/services/userService";
import AlertMessage from "@/components/AlertMessage.vue";

const emit = defineEmits(["switchToLogin"]);

const user = ref({
  username: "",
  email: "",
  phone: "",
  password: "",
});

const alertMessage = ref("");
const alertType = ref("success");

const handleRegister = async () => {
  try {
    alertMessage.value = "";
    alertType.value = "success";
    const response = await userService.register(user.value);
    alertMessage.value = response.message;
    alertType.value = "success";
    user.value = { username: "", email: "", phone: "", password: "" };
    setTimeout(() => {
      emit("switchToLogin");
    }, 3000);
  } catch (error) {
    alertMessage.value = error.message || "Có lỗi xảy ra!";
    alertType.value = "error";
  }
};
</script>

<style scoped>
.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
}

.login-card {
  width: 100%;
  background: white;
  border-radius: 10px;
  padding: 20px;
}
</style>
