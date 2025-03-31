<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>{{ isEdit ? "Cập nhật Người Dùng" : "Thêm Người Dùng" }}</h3>
      <AlertMessage
        v-if="alertMessage"
        :message="alertMessage"
        :type="alertType"
      />

      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">Tên người dùng</label>
          <input
            v-model="user.username"
            type="text"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input
            v-model="user.email"
            type="email"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Số điện thoại</label>
          <input
            v-model="user.phone"
            type="text"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input
            v-model="user.password"
            type="password"
            class="form-control"
            :required="!isEdit"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Quyền</label>
          <select v-model="user.role" class="form-control">
            <option value="client">Khách hàng</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Ảnh đại diện</label>
          <input
            type="file"
            @change="handleFileUpload"
            class="form-control"
            accept="image/*"
          />
          <img
            v-if="user.avatar_url"
            :src="`http://localhost:5000${user.avatar_url}`"
            alt="Avatar"
            width="50"
            class="preview-image"
          />
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-success">
            {{ isEdit ? "Cập nhật" : "Thêm" }}
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import userService from "@/services/userService";
import AlertMessage from "@/components/AlertMessage.vue";

const props = defineProps({
  userData: Object,
  isEdit: Boolean,
  token: String,
  currentUserRole: String,
});

const emit = defineEmits(["close", "saved"]);
const user = ref({ ...props.userData });
const alertMessage = ref("");
const alertType = ref("success");
const isAdmin = computed(() => props.currentUserRole === "admin");

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    user.value.avatar = file;
  }
};

const submitForm = async () => {
  try {
    const formData = new FormData();
    for (const key in user.value) {
      formData.append(key, user.value[key]);
    }

    if (props.isEdit) {
      await userService.updateUser(user.value.id, formData, props.token);
      alertMessage.value = "Cập nhật người dùng thành công";
    } else {
      await userService.adminRegister(formData, props.token);
      alertMessage.value = "Thêm người dùng thành công";
    }
    alertType.value = "success";

    setTimeout(() => {
      alertMessage.value = "";
      emit("saved");
      emit("close");
    }, 3000);
  } catch (error) {
    alertMessage.value = error.message || "Đã có lỗi xảy ra";
    alertType.value = "error";
    setTimeout(() => {
      alertMessage.value = "";
    }, 3000);
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 450px;
}
.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>
