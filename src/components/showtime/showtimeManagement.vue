<template>
  <div class="container mt-4">
    <h2 class="mb-4">Quản lý Suất Chiếu</h2>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-primary" @click="openShowtimeForm">
        Thêm Suất Chiếu
      </button>
      <div class="input-group" style="width: 350px">
        <input
          v-model="searchQuery"
          class="form-control"
          placeholder="Tìm kiếm suất chiếu theo phim, phòng, ngày..."
        />
        <button class="btn btn-primary">🔍</button>
      </div>
    </div>
    <AlertMessage
      v-if="alertMessage"
      :message="alertMessage"
      :type="alertType"
    />

    <table class="table table-bordered table-striped" v-if="showtimes.length">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Phim</th>
          <th>Phòng</th>
          <th>Thời gian bắt đầu</th>
          <th>Thời gian kết thúc</th>
          <th>Giá</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="showtime in filteredShowtimes" :key="showtime.id">
          <td>{{ showtime.id }}</td>
          <td>{{ showtime.Movie.name }}</td>
          <td>{{ showtime.Room.name }}</td>
          <td>{{ formatDate(showtime.start_time) }}</td>
          <td>{{ formatDate(showtime.end_time) }}</td>
          <td>{{ showtime.price }} VND</td>
          <td>
            <button
              v-if="new Date(showtime.start_time) > new Date()"
              class="btn btn-warning btn-sm me-2"
              @click="editShowtime(showtime)"
            >
              Cập nhật
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="deleteShowtime(showtime.id)"
            >
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-center text-muted">Không có suất chiếu nào</p>

    <ShowtimeForm
      v-if="showShowtimeForm"
      @close="closeShowtimeForm"
      @refreshList="fetchShowtimes"
      :token="authToken"
      :showtime="selectedShowtime"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import showtimeService from "@/services/showtimeService";
import AlertMessage from "@/components/AlertMessage.vue";
import ShowtimeForm from "./showtimeForm.vue";

export default {
  components: { AlertMessage, ShowtimeForm },
  setup() {
    const showtimes = ref([]);
    const alertMessage = ref("");
    const alertType = ref("success");
    const showShowtimeForm = ref(false);
    const selectedShowtime = ref(null);
    const authToken = ref(localStorage.getItem("token"));
    const searchQuery = ref("");
    const fetchShowtimes = async () => {
      try {
        const response = await showtimeService.getAllShowtimes();
        if (response.success) {
          showtimes.value = response.data;
        } else {
          alertMessage.value = response.message || "Lỗi khi tải suất chiếu";
          alertType.value = "error";
        }
      } catch (error) {
        alertMessage.value = "Lỗi kết nối API";
        alertType.value = "error";
      }
    };

    const deleteShowtime = async (showtimeId) => {
      if (!confirm("Bạn có chắc chắn muốn xóa suất chiếu này?")) return;
      try {
        alertMessage.value = "";
        await showtimeService.deleteShowtime(showtimeId, authToken.value);
        alertMessage.value = "Xóa suất chiếu thành công";
        alertType.value = "success";
        fetchShowtimes();
      } catch (error) {
        alertMessage.value = error.message || "Lỗi khi xóa suất chiếu";
        alertType.value = "error";
      }
    };

    const openShowtimeForm = () => {
      selectedShowtime.value = null;
      showShowtimeForm.value = true;
    };
    const editShowtime = (showtime) => {
      selectedShowtime.value = { ...showtime }; // Gán dữ liệu cần sửa
      showShowtimeForm.value = true;
    };
    const closeShowtimeForm = () => {
      showShowtimeForm.value = false;
      fetchShowtimes();
    };

    const formatDate = (datetime) => {
      return new Date(datetime).toLocaleString("vi-VN");
    };
    // const formatDate = (datatime) => {
    //   if (!datatime) return "";
    //   const date = new Date(datatime);
    //   return date.toISOString().slice(0, 16); // Cắt phần giây và múi giờ
    // };

    const filteredShowtimes = computed(() => {
      if (!searchQuery.value) return showtimes.value;

      // Tách từ khóa theo dấu phẩy, loại bỏ khoảng trắng dư thừa
      const keywords = searchQuery.value
        .toLowerCase()
        .split(",")
        .map((k) => k.trim());

      return showtimes.value.filter((showtime) => {
        const movieName = showtime.Movie.name.toLowerCase();
        const roomName = showtime.Room.name.toLowerCase();
        const showDate = formatDate(showtime.start_time).toLowerCase();

        // Kiểm tra tất cả từ khóa phải có trong dữ liệu
        return keywords.every(
          (keyword) =>
            movieName.includes(keyword) ||
            roomName.includes(keyword) ||
            showDate.includes(keyword)
        );
      });
    });

    onMounted(fetchShowtimes);

    return {
      showtimes,
      filteredShowtimes,
      alertMessage,
      alertType,
      deleteShowtime,
      showShowtimeForm,
      openShowtimeForm,
      selectedShowtime,
      editShowtime,
      closeShowtimeForm,
      fetchShowtimes,
      authToken,
      formatDate,
      searchQuery,
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
