<template>
  <div class="sidebar-container">
    <!-- Video nền -->
    <div class="video-background position-relative">
      <iframe
        :src="selectedMovie ? selectedMovie.trailer_url : defaultTrailer"
        frameborder="0"
        allowfullscreen
        class="video-frame"
      ></iframe>
      <div class="overlay"></div>
    </div>

    <!-- Nội dung phim -->
    <div v-if="selectedMovie" class="movie-info text-white">
      <h1 class="fw-bold">{{ selectedMovie.name }}</h1>
      <p class="text-light">{{ selectedMovie.description }}</p>
      <p>
        <strong>🕒 Giờ chiếu:</strong>
        {{ formatDateTime(selectedMovie.start_time) }}
      </p>
      <p>
        <strong>Phòng:</strong> {{ selectedMovie.room_name }} -
        <strong>Giá:</strong> {{ selectedMovie.price }} VNĐ
      </p>

      <button
        @click="$router.push(`/movie/${selectedMovie.id}`)"
        class="btn btn-outline-light btn-sm mt-2 me-2"
      >
        📜 Chi tiết
      </button>
      <button
        class="btn btn-outline-light btn-sm mt-2"
        @click="
          openSeatSelection(
            selectedMovie.id_showtime,
            selectedMovie.start_time,
            selectedMovie.price
          )
        "
      >
        Mua vé ngay
      </button>
    </div>

    <!-- Carousel danh sách phim -->
    <div class="movie-list">
      <button @click="prevSlide" class="carousel-btn left">‹</button>
      <div class="carousel-container">
        <div
          class="carousel-track"
          :style="{ transform: `translateX(-${currentIndex * 25}%)` }"
        >
          <div
            v-for="(movie, index) in loopedMovies"
            :key="index"
            class="movie-item"
            @click="onPlayMovie(movie)"
            :style="{ flex: `0 0 25%` }"
          >
            <img
              :src="`http://localhost:5000${movie.poster_url}`"
              :alt="movie.name"
              class="movie-poster img-fluid rounded-3"
            />
          </div>
        </div>
      </div>
      <button @click="nextSlide" class="carousel-btn right">›</button>
    </div>
    <!-- Seat Selection Modal -->
    <SeatSelection
      v-if="showSeatSelection"
      :show="showSeatSelection"
      :movieTitle="selectedMovie.name"
      :showtimeDate="showtimeDate"
      :showtimeTime="showtimeTime"
      :showtimeId="showtimeId"
      :price="Number(price)"
      @close="showSeatSelection = false"
    />
  </div>
</template>

<script>
import showtimeService from "@/services/showtimeService";
import SeatSelection from "@/components/home/seatSelection.vue";

export default {
  components: { SeatSelection },
  data() {
    return {
      movies: [],
      selectedMovie: null,
      currentIndex: 4, // Đặt vị trí ban đầu ở phần tử 4 (vì ta nhân đôi danh sách để vòng lặp mượt hơn)
      defaultTrailer:
        "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&loop=1",
      showSeatSelection: false,
      showtimeId: null,
      showtimeDate: null,
      showtimeTime: null,
      price: null,
    };
  },
  computed: {
    loopedMovies() {
      // Nhân đôi danh sách phim để tạo hiệu ứng vòng lặp vô hạn
      return [...this.movies, ...this.movies];
    },
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await showtimeService.getShowtimesByToday();
        if (response.data.length === 0) {
          this.movies = [];
          this.selectedMovie = null;
          return;
        }

        this.movies = response.data.map((showtime) => ({
          id_showtime: showtime.id,
          id: showtime.movie_id,
          name: showtime.Movie?.name || "Không có thông tin",
          description: showtime.Movie?.description || "Không có mô tả",
          trailer_url: showtime.Movie?.trailer_url || this.defaultTrailer,
          poster_url: showtime.Movie?.poster_url || "/default-poster.jpg",
          start_time: showtime.start_time,
          room_name: showtime.Room?.name || "Chưa xác định",
          price: showtime.price || "Chưa có giá",
        }));

        if (this.movies.length > 0) {
          this.onPlayMovie(this.movies[0]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách phim:", error);
      }
    },
    onPlayMovie(movie) {
      let videoId = "";
      if (movie.trailer_url && movie.trailer_url.includes("youtu.be")) {
        videoId = movie.trailer_url.split("youtu.be/")[1].split("?")[0];
      } else if (
        movie.trailer_url &&
        movie.trailer_url.includes("youtube.com/watch")
      ) {
        const urlParams = new URLSearchParams(
          new URL(movie.trailer_url).search
        );
        videoId = urlParams.get("v");
      }

      this.selectedMovie = {
        ...movie,
        trailer_url: videoId
          ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&loop=1&playlist=${videoId}`
          : this.defaultTrailer,
      };
    },
    prevSlide() {
      if (this.currentIndex === 0) {
        this.currentIndex = this.movies.length; // Khi về đầu, nhảy tới vị trí lặp
      }
      this.currentIndex--;
    },
    nextSlide() {
      this.currentIndex++;
      if (this.currentIndex === this.movies.length * 2 - 4) {
        this.currentIndex = this.movies.length - 4; // Khi đến cuối, nhảy lại vị trí lặp
      }
    },
    formatDateTime(dateTime) {
      const date = new Date(dateTime);
      return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
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
  created() {
    this.fetchMovies();
  },
};
</script>

<style scoped>
.sidebar-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: black;
}

.video-background {
  position: absolute;
  width: 100%;
  height: 100%;
}

.video-frame {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.movie-info {
  position: absolute;
  top: 25%;
  left: 5%;
  max-width: 40vw;
  z-index: 2;
}

.movie-list {
  position: absolute;
  bottom: 0%;
  right: 5%;
  max-width: 50vw;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}
.movie-poster {
  width: 100%;
  border-radius: 8px;
  height: 300px;
  object-fit: cover;
}
.carousel-container {
  height: 400px;
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  will-change: transform;
}

.movie-item {
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  padding: 40px 10px 10px 10px;
}

.movie-item:hover {
  transform: scale(1.1);
}

.movie-poster {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.carousel-btn {
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.left {
  left: -40px;
}

.right {
  right: -40px;
}
</style>
