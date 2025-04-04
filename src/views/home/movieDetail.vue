<template>
  <Header />
  <div class="container movie-detail" v-if="movie">
    <!-- Movie Header -->
    <div class="row movie-header">
      <div class="col-md-4 d-flex justify-content-center">
        <img
          :src="`http://localhost:5000${movie.poster_url}`"
          alt="Poster phim"
          class="movie-poster"
        />
      </div>
      <div class="col-md-8">
        <h1>{{ movie.name }}</h1>
        <p><strong>Thể loại:</strong> {{ movie.genre }}</p>
        <p><strong>Thời gian:</strong> {{ movie.duration }} phút</p>
        <p>
          <strong>Ngày phát hành:</strong> {{ formatDate(movie.release_date) }}
        </p>
        <p><strong>Mô tả:</strong> {{ movie.description }}</p>
        <!-- Xem trailer -->
        <button
          class="btn btn-outline-light btn-sm"
          @click="showTrailer = true"
        >
          Xem trailer
        </button>
      </div>
    </div>

    <!-- Showtimes -->
    <div class="showtimes" v-if="movie.Showtimes.length">
      <h2 class="mt-4">Danh sách suất chiếu</h2>
      <div class="row">
        <div
          class="col-md-3 col-sm-6 mb-4"
          v-for="showtime in movie.Showtimes"
          :key="showtime.id"
        >
          <div class="card text-white bg-dark">
            <div class="card-body">
              <h5 class="card-title">Phòng {{ showtime.Room.name }}</h5>
              <p class="card-text">
                <strong>Giờ chiếu:</strong>
                <span class="showtime-time">{{
                  formatDate(showtime.start_time)
                }}</span>
              </p>
              <p class="card-text">
                <strong>Giá vé:</strong> {{ showtime.price }} VND
              </p>
              <button
                class="btn btn-outline-light btn-sm"
                @click="
                  openSeatSelection(
                    showtime.id,
                    showtime.start_time,
                    showtime.price
                  )
                "
              >
                Mua vé
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-4 text-center">
      <p>Hiện không có suất chiếu cho phim này.</p>
    </div>
    <!-- Video Player Modal -->
    <videoPlayer
      v-if="showTrailer"
      :show="showTrailer"
      :videoUrl="movie.trailer_url"
      :movieTitle="movie.name"
      @close="showTrailer = false"
    />
    <!-- Seat Selection Modal -->
    <SeatSelection
      v-if="showSeatSelection"
      :show="showSeatSelection"
      :movieTitle="movie.name"
      :showtimeDate="showtimeDate"
      :showtimeTime="showtimeTime"
      :showtimeId="showtimeId"
      :price="Number(price)"
      @close="showSeatSelection = false"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Header from "@/components/home/header.vue";
import { useRoute } from "vue-router";
import movieService from "@/services/movieService";
import videoPlayer from "@/components/videoPlayer.vue";
import SeatSelection from "@/components/home/seatSelection.vue";

export default {
  components: {
    Header,
    videoPlayer,
    SeatSelection,
  },
  data() {
    return {
      movie: null,
      showTrailer: false,
      showSeatSelection: false,
      showtimeId: null,
      showtimeDate: null,
      showtimeTime: null,
      price: null,
    };
  },
  methods: {
    async fetchMovieDetails(id) {
      try {
        const response = await movieService.getMovieById(id);
        this.movie = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin phim:", error.message);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString("vi-VN");
    },
    openSeatSelection(showtimeId, startTime, price) {
      this.showtimeId = showtimeId;
      this.showtimeDate = this.formatDate(new Date(startTime)).split(" ")[1]; // Lấy ngày chiếu
      this.showtimeTime = this.formatDate(new Date(startTime)).split(" ")[0]; // Lấy giờ chiếu
      this.showSeatSelection = true;
      this.price = price;
    },
  },

  mounted() {
    const route = useRoute();
    const movieId = route.params.id; // Lấy ID từ route
    this.fetchMovieDetails(movieId);
  },
};
</script>

<style scoped>
.movie-detail {
  background-color: #121212;
  color: white;
  padding: 20px;
  margin-top: 100px;
  border-radius: 8px;
}

.movie-poster {
  width: 100%;
  height: auto;
  max-width: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.movie-info h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.movie-info p {
  font-size: 1rem;
  margin: 5px 0;
}

.showtimes {
  margin-top: 30px;
}

.card {
  background-color: #222;
  border-radius: 8px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
}

.card-text {
  font-size: 0.9rem;
}

.showtime-time {
  color: #ffcc00;
}
</style>
