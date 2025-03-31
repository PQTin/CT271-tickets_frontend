<template>
  <div class="container mt-4">
    <h2 class="mb-3">
      Quản lý {{ currentRole === "admin" ? "Quản trị viên" : "Khách hàng" }}
    </h2>
    <button class="btn btn-primary mb-3" @click="toggleRole">
      {{ currentRole === "admin" ? "Quản lý Người Dùng" : "Quản lý Admin" }}
    </button>

    <button class="btn btn-success mb-3 ms-2" @click="openForm(null)">
      Thêm tài khoản
    </button>
    <AlertMessage
      v-if="alertMessage"
      :message="alertMessage"
      :type="alertType"
    />

    <table class="table table-bordered table-striped" v-if="users.length">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Tên Người Dùng</th>
          <th>Số Điện Thoại</th>
          <th>Email</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="openForm(user)">
              Cập nhật
            </button>
            <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-center text-muted">Không có người dùng nào</p>

    <UserForm
      v-if="showForm"
      :userData="selectedUser"
      :isEdit="isEdit"
      :token="authToken"
      @close="closeForm"
      @saved="fetchUsers"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import userService from "@/services/userService";
import AlertMessage from "@/components/AlertMessage.vue";
import UserForm from "./userForm.vue";

export default {
  components: { AlertMessage, UserForm },
  setup() {
    const users = ref([]);
    const alertMessage = ref("");
    const alertType = ref("success");
    const currentRole = ref("client");
    const authToken = ref(localStorage.getItem("token"));
    const showForm = ref(false);
    const selectedUser = ref(null);
    const isEdit = ref(false);

    const fetchUsers = async () => {
      try {
        const response = await userService.getUsersByRole(
          currentRole.value,
          authToken.value
        );
        if (response.success) {
          users.value = response.users;
        } else {
          alertMessage.value = response.message;
          alertType.value = "error";
        }
      } catch (error) {
        alertMessage.value =
          error.message || "Lỗi khi tải danh sách người dùng";
        alertType.value = "error";
      }
    };

    const deleteUser = async (userId) => {
      if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
      try {
        alertMessage.value = "";
        await userService.deleteUser(userId, authToken.value);
        alertMessage.value = "Xóa người dùng thành công";
        alertType.value = "success";
        fetchUsers();
      } catch (error) {
        alertMessage.value = error.message || "Lỗi khi xóa người dùng";
        alertType.value = "error";
      }
    };

    const toggleRole = () => {
      currentRole.value = currentRole.value === "admin" ? "client" : "admin";
      fetchUsers();
    };

    const openForm = (user) => {
      selectedUser.value = user ? { ...user } : {};
      isEdit.value = !!user;
      showForm.value = true;
    };

    const closeForm = () => {
      showForm.value = false;
      selectedUser.value = null;
    };

    onMounted(fetchUsers);

    return {
      users,
      alertMessage,
      alertType,
      deleteUser,
      toggleRole,
      currentRole,
      fetchUsers,
      authToken,
      showForm,
      openForm,
      closeForm,
      selectedUser,
      isEdit,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 100%;
  margin: 0;
  padding: 0 20px;
}
</style>
