<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-white text-center">Danh Sách Suất Chiếu 7 Ngày Tới</h2>

    <div class="row justify-content-center">
      <div
        v-for="showtime in paginatedShowtimes"
        :key="showtime.id"
        class="col-md-4 col-lg-3 mb-4"
      >
        <div
          class="card showtime-card"
          :class="{ 'expanded-card': selectedShowtimeId === showtime.id }"
        >
          <div class="showtime-content">
            <div class="showtime-image">
              <img
                :src="`http://localhost:5000${showtime.Movie.poster_url}`"
                class="card-img-top"
                alt="Poster phim"
              />
            </div>
            <transition name="fade">
              <div
                v-if="selectedShowtimeId === showtime.id"
                class="showtime-details"
              >
                <p><strong>Phòng:</strong> {{ showtime.Room.name }}</p>
                <p><strong>Giá:</strong> {{ showtime.price }} VND</p>
                <p>
                  <strong>Ngày chiếu:</strong>
                  {{ formatDate(showtime.start_time) }}
                </p>
                <button
                  class="btn btn-outline-light btn-sm"
                  @click="goToMovieDetail(showtime.Movie.id)"
                >
                  Chi tiết phim
                </button>
              </div>
            </transition>
          </div>
          <div class="card-body text-center">
            <h4 class="movie-title">{{ showtime.Movie.name }}</h4>
            <button
              class="btn btn-outline-light btn-sm mt-2 me-2"
              @click="toggleDetails(showtime.id)"
            >
              {{ selectedShowtimeId === showtime.id ? "Thu gọn" : "Chi tiết" }}
            </button>
            <!-- Thêm nút Mua vé ngay -->
            <button
              class="btn btn-outline-light btn-sm mt-2"
              @click="openSeatSelectionModal(showtime)"
            >
              Mua vé
            </button>
          </div>
        </div>
      </div>
    </div>

    <nav v-if="totalPages > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(currentPage - 1)">
            Trước
          </button>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="changePage(page)">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="changePage(currentPage + 1)">
            Sau
          </button>
        </li>
      </ul>
    </nav>
    <!-- Modal Seat Selection -->
    <SeatSelection
      v-if="showSeatSelectionModal"
      :show="showSeatSelectionModal"
      :movieTitle="selectedShowtime.Movie.name"
      :showtimeDate="formatDate(selectedShowtime.start_time)"
      :showtimeTime="formatTime(selectedShowtime.start_time)"
      :showtimeId="selectedShowtime.id"
      :price="Number(selectedShowtime.price)"
      @close="closeSeatSelectionModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import showtimeService from "@/services/showtimeService";
import SeatSelection from "./seatSelection.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const goToMovieDetail = (movieId) => {
  router.push(`/movie/${movieId}`);
};
const showtimes = ref([]);
const selectedShowtimeId = ref(null);
const currentPage = ref(1);
const itemsPerPage = 4;
const selectedShowtime = ref(null);
const showSeatSelectionModal = ref(false);

const fetchShowtimes = async () => {
  const response = await showtimeService.getShowtimesByWeek();
  if (response.success) {
    showtimes.value = response.data;
  }
};

fetchShowtimes();

const toggleDetails = (id) => {
  selectedShowtimeId.value = selectedShowtimeId.value === id ? null : id;
};

const formatDate = (date) => new Date(date).toLocaleString("vi-VN");
const formatTime = (date) => new Date(date).toLocaleTimeString("vi-VN");
const totalPages = computed(() =>
  Math.ceil(showtimes.value.length / itemsPerPage)
);
const paginatedShowtimes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return showtimes.value.slice(start, start + itemsPerPage);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
const openSeatSelectionModal = (showtime) => {
  selectedShowtime.value = showtime;
  showSeatSelectionModal.value = true;
};

const closeSeatSelectionModal = () => {
  showSeatSelectionModal.value = false;
};
</script>

<style scoped>
.container {
  background-color: #121212;
  padding: 20px;
  border-radius: 10px;
}
.showtime-card {
  min-height: 500px;
  border-radius: 12px;
  overflow: hidden;
  background: #222;
  color: white;
  padding: 10px;
  box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease-in-out;
}
.expanded-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
}
.showtime-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease-in-out;
}
.showtime-image img {
  width: 250px;
  height: 360px;
  object-fit: cover;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}
.expanded-card .showtime-image img {
  width: 180px;
  height: 260px;
}
.movie-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #f8f9fa; /* Màu sáng hơn để nổi bật */
}

.showtime-details {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.showtime-details button {
  display: block;
  margin: 10px auto 0;
}
.expanded-card .showtime-details {
  opacity: 1;
  max-height: 200px;
  padding: 10px;
}
.pagination .page-link {
  background: #333;
  color: white;
  border: none;
}
.pagination .active .page-link {
  background: #007bff;
}
</style>
