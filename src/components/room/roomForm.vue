<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>Thêm Phòng</h3>
      <AlertMessage
        v-if="alertMessage"
        :message="alertMessage"
        :type="alertType"
      />
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">Tên Phòng</label>
          <input
            type="text"
            v-model="roomData.name"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Số Ghế</label>
          <input
            type="number"
            v-model="roomData.total_seats"
            class="form-control"
            required
          />
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-success">Thêm</button>
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

<script>
import { ref } from "vue";
import roomService from "@/services/roomService";
import AlertMessage from "@/components/AlertMessage.vue";

export default {
  components: { AlertMessage },
  props: { token: String },
  setup(props, { emit }) {
    const roomData = ref({ name: "", total_seats: "" });
    const alertMessage = ref("");
    const alertType = ref("success");

    const submitForm = async () => {
      try {
        alertMessage.value = "";
        alertType.value = "success";
        await roomService.createRoom(roomData.value, props.token);
        alertMessage.value = "Thêm phòng thành công!";
        alertType.value = "success";
        emit("refreshList");
        setTimeout(() => emit("close"), 3000);
      } catch (error) {
        alertMessage.value = error.message || "Có lỗi xảy ra!";
        alertType.value = "error";
      }
    };

    return { roomData, submitForm, alertMessage, alertType };
  },
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
  width: 400px;
}
.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>
