<template>
  <Header />
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-white flex-grow-1">Suất Chiếu Hiện Có</h2>
      <div class="input-group" style="width: 350px">
        <input
          type="text"
          v-model="searchQuery"
          class="form-control"
          placeholder="Tìm theo tên phim, ngày chiếu."
        />
        <button class="btn btn-primary">🔍</button>
      </div>
    </div>

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
            <div
              v-if="showtime.booked_seats === showtime.Room.total_seats"
              style="color: red"
            >
              Hết vé.
            </div>
            <div v-else style="color: green">
              Còn
              {{ showtime.Room.total_seats - showtime.booked_seats }} vé.
            </div>
            <button
              class="btn btn-outline-light btn-sm mt-2 me-2"
              @click="toggleDetails(showtime.id)"
            >
              {{ selectedShowtimeId === showtime.id ? "Thu gọn" : "Chi tiết" }}
            </button>
            <!-- Thêm nút Mua vé ngay -->
            <button
              v-if="showtime.booked_seats != showtime.Room.total_seats"
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
import SeatSelection from "@/components/home/seatSelection.vue";
import { useRouter } from "vue-router";
import Header from "@/components/home/header.vue";

const router = useRouter();

const goToMovieDetail = (movieId) => {
  router.push(`/movie/${movieId}`);
};
const showtimes = ref([]);
const selectedShowtimeId = ref(null);
const currentPage = ref(1);
const itemsPerPage = 8;
const selectedShowtime = ref(null);
const showSeatSelectionModal = ref(false);

const fetchShowtimes = async () => {
  const response = await showtimeService.getAllShowtimes();
  if (response.success) {
    showtimes.value = response.data.map((showtime) => {
      const bookedSeats = Number(showtime.booked_seats);
      const totalSeats = Number(showtime.Room.total_seats);
      return {
        ...showtime,
        booked_seats: bookedSeats, // Thêm số ghế đã đặt từ API
        total_seats: totalSeats, // Thêm số ghế trong phòng từ API
      };
    });
  }
};

fetchShowtimes();

const toggleDetails = (id) => {
  selectedShowtimeId.value = selectedShowtimeId.value === id ? null : id;
};

const formatDate = (date) => new Date(date).toLocaleString("vi-VN");
const formatTime = (date) => new Date(date).toLocaleTimeString("vi-VN");
const totalPages = computed(() =>
  Math.ceil(filteredShowtimes.value.length / itemsPerPage)
);
const paginatedShowtimes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredShowtimes.value.slice(start, start + itemsPerPage);
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
const searchQuery = ref("");
const filteredShowtimes = computed(() => {
  if (!searchQuery.value) return showtimes.value;

  const queryParts = searchQuery.value
    .split(",")
    .map((part) => part.trim().toLowerCase());

  return showtimes.value.filter((showtime) => {
    const movieName = showtime.Movie.name.toLowerCase();
    const showtimeStart = new Date(showtime.start_time);
    const showtimeString = showtimeStart.toLocaleString().toLowerCase();

    // Kiểm tra nếu bất kỳ từ khóa nào khớp với tên phim hoặc giờ chiếu
    return queryParts.every((query) => {
      const isDate = /\d{1,2}\/\d{1,2}\/\d{4}/.test(query); // Kiểm tra định dạng dd/mm/yyyy
      const isDayMonth = /\d{1,2}\/\d{1,2}$/.test(query); // kiểm tra dd/mm

      if (isDate) {
        const [day, month, year] = query
          .split("/")
          .map((num) => parseInt(num, 10));
        const searchDate = new Date(year, month - 1, day); // Chuyển chuỗi thành Date
        return (
          showtimeStart.getDate() === searchDate.getDate() &&
          showtimeStart.getMonth() === searchDate.getMonth() &&
          showtimeStart.getFullYear() === searchDate.getFullYear()
        );
      } else if (isDayMonth) {
        const [day, month] = query.split("/").map((num) => parseInt(num, 10));
        return (
          showtimeStart.getDate() === day &&
          showtimeStart.getMonth() === month - 1
        );
      }

      return movieName.includes(query) || showtimeString.includes(query);
    });
  });
});
</script>

<style scoped>
.container {
  background-color: #121212;
  margin-top: 100px;
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
