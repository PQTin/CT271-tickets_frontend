<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-white">Quản lý Phim</h2>
    <AlertMessage
      v-if="alertMessage"
      :message="alertMessage"
      :type="alertType"
    />

    <div v-if="movies.length === 0" class="alert alert-warning">
      Kho phim hiện đang trống.
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-primary" @click="openModal(null)">
        Thêm Phim
      </button>
      <div class="input-group" style="width: 350px">
        <input
          v-model="searchQuery"
          class="form-control"
          placeholder="Tìm theo ID, tên phim hoặc thể loại..."
        />
        <button class="btn btn-primary">🔍</button>
      </div>
    </div>

    <VideoPlayer
      :show="showTrailer"
      :videoUrl="trailerUrl"
      :movieTitle="movieTitle"
      @close="closeTrailer"
    />

    <table v-if="movies.length > 0" class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Poster</th>
          <th>Tên Phim</th>
          <th>Thể Loại</th>
          <th>Thời Lượng</th>
          <th>Ngày Phát Hành</th>
          <th>Mô Tả</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="movie in filteredMovies" :key="movie.id">
          <td>{{ movie.id }}</td>
          <td>
            <img
              :src="getImageUrl(movie.poster_url)"
              alt="Poster phim"
              width="80"
            />
          </td>
          <td>{{ movie.name }}</td>
          <td>{{ movie.genre }}</td>
          <td>{{ movie.duration }} phút</td>
          <td>{{ movie.release_date }}</td>
          <td>
            <span v-if="movie.description.length <= 30">
              {{ movie.description }}
            </span>
            <span v-else>
              {{ getShortDescription(movie.description) }}
              <span
                class="text-primary"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :title="movie.description"
                >[...]</span
              >
            </span>
          </td>
          <td>
            <button
              class="btn btn-warning btn-sm me-2"
              @click="openModal(movie)"
            >
              Sửa
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="deleteMovie(movie.id)"
            >
              Xóa
            </button>
            <button
              class="btn btn-info btn-sm"
              @click="playTrailer(movie.name, movie.trailer_url)"
            >
              🎬 Trailer
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <MovieForm
      v-if="showModal"
      :movieData="selectedMovie"
      :isEdit="!!selectedMovie"
      :token="token"
      @close="showModal = false"
      @saved="fetchMovies"
    />
  </div>
</template>

<script>
import { onMounted, nextTick } from "vue";
import { Tooltip } from "bootstrap";
import movieService from "@/services/movieService";
import MovieForm from "./movieForm.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import VideoPlayer from "@/components/videoPlayer.vue";
import { useAuthStore } from "@/store/authStore";
export default {
  components: { MovieForm, AlertMessage, VideoPlayer },
  data() {
    const authStore = useAuthStore();
    return {
      movies: [],
      showModal: false,
      selectedMovie: null,
      alertMessage: "",
      alertType: "success",
      token: authStore.token,
      showTrailer: false,
      trailerUrl: "",
      movieTitle: "",
      searchQuery: "",
    };
  },
  methods: {
    async fetchMovies() {
      const response = await movieService.getAllMovies();
      this.movies = response.data;
      await nextTick(); // Chờ Vue cập nhật DOM trước khi khởi tạo Tooltip
      this.initTooltips();
    },
    openModal(movie) {
      this.selectedMovie = movie;
      this.showModal = true;
    },
    async deleteMovie(id) {
      if (confirm("Bạn có chắc muốn xóa phim này?")) {
        try {
          await movieService.deleteMovie(id, this.token);
          this.fetchMovies();
          this.alertMessage = "Xóa phim thành công!";
          this.alertType = "success";
        } catch (error) {
          this.alertMessage = error.message || "Lỗi khi xóa phim!";
          this.alertType = "error";
        }
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      }
    },
    getImageUrl(path) {
      return `http://localhost:5000${path}`;
    },
    getShortDescription(description) {
      return description.split(" ").slice(0, 30).join(" ");
    },
    initTooltips() {
      const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
      );
      tooltipTriggerList.forEach((el) => new Tooltip(el));
    },
    playTrailer(title, url) {
      if (!url) {
        alert("Phim này chưa có trailer!");
        return;
      }
      this.trailerUrl = url;
      this.showTrailer = true;
      this.movieTitle = title;
    },
    closeTrailer() {
      this.showTrailer = false;
      this.trailerUrl = "";
    },
  },
  computed: {
    filteredMovies() {
      if (!this.searchQuery) {
        return this.movies; // Nếu không nhập gì, hiển thị toàn bộ danh sách
      }

      const query = this.searchQuery.toLowerCase();
      return this.movies.filter((movie) => {
        return (
          movie.id.toString().includes(query) || // Tìm theo ID
          movie.name.toLowerCase().includes(query) || // Tìm theo tên phim
          movie.genre.toLowerCase().includes(query) // Tìm theo thể loại
        );
      });
    },
  },
  mounted() {
    this.fetchMovies();
  },
};
</script>

<style scoped>
.container {
  max-width: 100%;
  padding: 0 20px;
}
.text-primary {
  cursor: pointer;
  font-weight: bold;
}
.table {
  width: 100%;
  table-layout: auto;
}

th,
td {
  padding: 10px;
  vertical-align: middle;
  text-align: center;
  white-space: nowrap; /* Không cho nội dung xuống dòng nếu không cần */
}
td:nth-child(7) {
  min-width: 250px;
  max-width: 250px;
  word-wrap: break-word; /* Ngắt dòng khi cần */
  white-space: normal; /* Cho phép xuống dòng */
  overflow: hidden;
}
img {
  display: block;
  max-width: 80px;
  height: auto;
  margin: 0 auto;
}
</style>
