<template>
  <div class="container mt-4">
    <h2 class="mb-4">Quản lý Phòng</h2>
    <AlertMessage
      v-if="alertMessage"
      :message="alertMessage"
      :type="alertType"
    />

    <button class="btn btn-primary mb-3" @click="openRoomForm">
      Thêm Phòng
    </button>

    <table class="table table-bordered table-striped" v-if="rooms.length">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Tên Phòng</th>
          <th>Số Ghế</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in rooms" :key="room.id">
          <td>{{ room.id }}</td>
          <td>{{ room.name }}</td>
          <td>{{ room.total_seats }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="deleteRoom(room.id)">
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-center text-muted">Không có phòng nào</p>

    <RoomForm
      v-if="showRoomForm"
      @close="closeRoomForm"
      @refreshList="fetchRooms"
      :token="authToken"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import roomService from "@/services/roomService";
import AlertMessage from "@/components/AlertMessage.vue";
import RoomForm from "./roomForm.vue";

export default {
  components: { AlertMessage, RoomForm },
  setup() {
    const rooms = ref([]);
    const alertMessage = ref("");
    const alertType = ref("success");
    const showRoomForm = ref(false);
    const authToken = ref(localStorage.getItem("token"));

    const fetchRooms = async () => {
      const response = await roomService.getRooms();
      if (response.success) {
        rooms.value = response.data;
      } else {
        alertMessage.value = response.message;
        alertType.value = "error";
      }
    };

    const deleteRoom = async (roomId) => {
      if (!confirm("Bạn có chắc chắn muốn xóa phòng này?")) return;
      try {
        alertMessage.value = "";
        alertType.value = "success";
        await roomService.deleteRoom(roomId, authToken.value);
        alertMessage.value = "Xóa phòng thành công";
        alertType.value = "success";
        fetchRooms();
      } catch (error) {
        alertMessage.value = error.message || "Lỗi khi xóa phòng";
        alertType.value = "error";
      }
    };

    const openRoomForm = () => {
      showRoomForm.value = true;
    };

    const closeRoomForm = () => {
      showRoomForm.value = false;
    };

    onMounted(fetchRooms);

    return {
      rooms,
      alertMessage,
      alertType,
      deleteRoom,
      showRoomForm,
      openRoomForm,
      closeRoomForm,
      fetchRooms,
      authToken,
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
