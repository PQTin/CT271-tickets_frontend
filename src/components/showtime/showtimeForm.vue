<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>{{ isEditing ? "Cập nhật" : "Thêm" }} Suất Chiếu</h3>
      <AlertMessage
        v-if="alertMessage"
        :message="alertMessage"
        :type="alertType"
      />
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">Chọn Phim</label>
          <select v-model="showtimeData.movie_id" class="form-control" required>
            <option v-for="movie in movies" :key="movie.id" :value="movie.id">
              {{ movie.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Chọn Phòng</label>
          <select v-model="showtimeData.room_id" class="form-control" required>
            <option v-for="room in rooms" :key="room.id" :value="room.id">
              {{ room.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Thời gian bắt đầu</label>
          <input
            type="datetime-local"
            v-model="showtimeData.start_time"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Thời gian kết thúc</label>
          <input
            type="datetime-local"
            v-model="showtimeData.end_time"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Giá vé</label>
          <input
            type="number"
            v-model="showtimeData.price"
            class="form-control"
            required
          />
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-success">
            {{ isEditing ? "Cập nhật" : "Thêm" }}
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

<script>
import { ref, onMounted } from "vue";
import showtimeService from "@/services/showtimeService";
import movieService from "@/services/movieService";
import roomService from "@/services/roomService";
import AlertMessage from "@/components/AlertMessage.vue";

export default {
  components: { AlertMessage },
  props: { token: String, showtime: Object },
  setup(props, { emit }) {
    const showtimeData = ref({
      movie_id: "",
      room_id: "",
      start_time: "",
      end_time: "",
      price: "",
    });
    const movies = ref([]);
    const rooms = ref([]);
    const alertMessage = ref("");
    const alertType = ref("success");
    const isEditing = ref(false);

    const fetchMoviesAndRooms = async () => {
      try {
        const movieResponse = await movieService.getAllMovies();
        if (movieResponse.success) movies.value = movieResponse.data;

        const roomResponse = await roomService.getRooms();
        if (roomResponse.success) rooms.value = roomResponse.data;
      } catch (error) {
        alertMessage.value = error.message || "Lỗi khi lấy dữ liệu";
        alertType.value = "error";
      }
    };

    const submitForm = async () => {
      try {
        alertMessage.value = "";
        alertType.value = "success";

        if (isEditing.value) {
          // Gọi API cập nhật suất chiếu
          await showtimeService.updateShowtime(
            showtimeData.value.id,
            showtimeData.value,
            props.token
          );
          alertMessage.value = "Cập nhật suất chiếu thành công!";
        } else {
          // Gọi API thêm suất chiếu mới
          await showtimeService.createShowtime(showtimeData.value, props.token);
          alertMessage.value = "Thêm suất chiếu thành công!";
        }
        alertType.value = "success";
        setTimeout(() => emit("close"), 3000);
      } catch (error) {
        alertMessage.value = error.message || "Có lỗi xảy ra!";
        alertType.value = "error";
      }
    };

    onMounted(() => {
      fetchMoviesAndRooms();
      if (props.showtime) {
        showtimeData.value = {
          ...props.showtime,
          start_time: formatDate(props.showtime.start_time),
          end_time: formatDate(props.showtime.end_time),
        };
        isEditing.value = true;
      }
    });
    const formatDate = (isoString) => {
      if (!isoString) return "";
      const date = new Date(isoString);
      return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0") +
        "T" +
        String(date.getHours()).padStart(2, "0") +
        ":" +
        String(date.getMinutes()).padStart(2, "0") +
        ":" +
        String(date.getSeconds()).padStart(2, "0")
      );
    };
    return {
      showtimeData,
      movies,
      rooms,
      submitForm,
      alertMessage,
      alertType,
      isEditing,
    };
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
