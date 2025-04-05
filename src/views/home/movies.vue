<template>
  <Header />
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-white flex-grow-1">Danh Sách Phim</h2>
      <div class="input-group" style="width: 350px">
        <input
          type="text"
          v-model="searchQuery"
          class="form-control"
          placeholder="Tìm theo tên phim, thể loại"
        />
        <button class="btn btn-primary">🔍</button>
      </div>
    </div>

    <div class="row justify-content-center">
      <div
        v-for="movie in filteredMovies"
        :key="movie.id"
        class="col-md-4 col-lg-3 mb-4"
      >
        <div class="card movie-card">
          <div class="movie-content">
            <div class="movie-image">
              <img
                :src="`http://localhost:5000${movie.poster_url}`"
                class="card-img-top"
                alt="Poster phim"
              />
            </div>
            <div class="card-body text-center">
              <h4 class="movie-title">{{ movie.name }}</h4>
              <p>{{ movie.genre }}</p>
              <button
                class="btn btn-outline-light btn-sm mt-2 me-2"
                @click="viewMovieDetails(movie.id)"
              >
                Chi Tiết
              </button>
              <button
                class="btn btn-outline-light btn-sm mt-2"
                @click="playTrailer(movie)"
              >
                Xem trailer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Movies Available -->
    <div v-if="movies.length === 0" class="alert alert-info text-center">
      Hiện tại chưa có phim nào.
    </div>
    <!-- Video Player Modal -->
    <videoPlayer
      v-if="showTrailer"
      :show="showTrailer"
      :videoUrl="trailerUrl"
      :movieTitle="movieTitle"
      @close="closeTrailer"
    />
  </div>
  <Footer />
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import movieService from "@/services/movieService";
import Header from "@/components/home/header.vue";
import videoPlayer from "@/components/videoPlayer.vue";
import Footer from "@/components/home/footer.vue";
export default defineComponent({
  components: {
    Header,
    Footer,
    videoPlayer,
  },
  setup() {
    const movies = ref([]);
    const searchQuery = ref("");
    const router = useRouter();
    const showTrailer = ref(false);
    const trailerUrl = ref("");
    const movieTitle = ref("");

    const getMovies = async () => {
      try {
        const data = await movieService.getAllMovies();
        movies.value = data.data;
      } catch (err) {
        console.error("Lỗi khi lấy danh sách phim: " + err.message);
      }
    };

    // Hàm tìm kiếm các phim theo nhiều từ khóa
    const filteredMovies = computed(() => {
      if (!searchQuery.value) return movies.value;

      const queryParts = searchQuery.value
        .split(",")
        .map((part) => part.trim().toLowerCase());
      return movies.value.filter((movie) => {
        const movieName = movie.name.toLowerCase();
        const movieGenre = movie.genre.toLowerCase();
        return queryParts.every((query) => {
          return movieName.includes(query) || movieGenre.includes(query);
        });
      });
    });

    const viewMovieDetails = (movieId) => {
      router.push(`/movie/${movieId}`);
    };

    const playTrailer = (movie) => {
      trailerUrl.value = movie.trailer_url;
      movieTitle.value = movie.name;
      showTrailer.value = true;
    };

    const closeTrailer = () => {
      showTrailer.value = false;
    };
    onMounted(() => {
      getMovies();
    });

    return {
      movies,
      searchQuery,
      filteredMovies,
      viewMovieDetails,
      showTrailer,
      trailerUrl,
      movieTitle,
      playTrailer,
      closeTrailer,
    };
  },
});
</script>

<style scoped>
.container {
  margin-top: 100px;
}

.movie-card {
  min-height: 450px;
  border-radius: 12px;
  overflow: hidden;
  background: #222;
  color: white;
  padding: 10px;
  box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease-in-out;
}

.movie-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.movie-image img {
  width: 250px;
  height: 360px;
  object-fit: cover;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}

.movie-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #f8f9fa;
}

.movie-card .card-body p {
  color: #bbb;
}
</style>
