<template>
  <div class="movie-carousel position-relative my-4">
    <button @click="moveLeft" class="carousel-btn left">‹</button>

    <div class="carousel-container">
      <div
        class="carousel-track"
        :style="{ transform: `translateX(-${currentIndex * cardWidth}px)` }"
        ref="carousel"
      >
        <div
          v-for="(movie, index) in movies"
          :key="movie.id + '-' + index"
          class="movie-card"
        >
          <img
            :src="`http://localhost:5000${movie.poster_url}`"
            class="movie-img"
            :alt="movie.name"
          />
          <div class="card-body text-center">
            <h5 class="card-title">{{ movie.name }}</h5>
            <button
              class="btn btn-outline-light btn-sm mt-2 me-2"
              @click="viewDetails(movie.id)"
            >
              Chi tiết
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

    <button @click="moveRight" class="carousel-btn right">›</button>
    <!-- Video Player Modal -->
    <videoPlayer
      v-if="showTrailer"
      :show="showTrailer"
      :videoUrl="trailerUrl"
      :movieTitle="movieTitle"
      @close="closeTrailer"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import movieService from "@/services/movieService";
import videoPlayer from "@/components/videoPlayer.vue";
import { useRouter } from "vue-router";

export default {
  components: {
    videoPlayer,
  },
  props: {
    genre: String,
  },
  setup(props) {
    const allMovies = ref([]);
    const currentIndex = ref(5);
    const cardWidth = 250;
    const router = useRouter();
    const movies = computed(() => [...allMovies.value, ...allMovies.value]);
    const getMovies = async () => {
      try {
        const res = await movieService.getMoviesByGenre(props.genre);
        allMovies.value = res.data;
      } catch (err) {
        console.error("Lỗi khi tải phim:", err);
      }
    };

    const moveLeft = () => {
      if (currentIndex.value === 0) {
        currentIndex.value = allMovies.value.length; // nhảy về giữa
      }
      currentIndex.value--;
    };

    const moveRight = () => {
      currentIndex.value++;
      if (currentIndex.value === allMovies.value.length * 2 - 5) {
        currentIndex.value = allMovies.value.length - 5;
      }
    };

    const viewDetails = (id) => {
      router.push(`/movie/${id}`);
    };
    const playTrailer = (movie) => {
      trailerUrl.value = movie.trailer_url;
      movieTitle.value = movie.name;
      showTrailer.value = true;
    };

    const closeTrailer = () => {
      showTrailer.value = false;
    };
    const showTrailer = ref(false);
    const trailerUrl = ref("");
    const movieTitle = ref("");

    onMounted(() => getMovies());

    return {
      movies,
      currentIndex,
      cardWidth,
      moveLeft,
      moveRight,
      viewDetails,
      showTrailer,
      trailerUrl,
      movieTitle,
      playTrailer,
      closeTrailer,
    };
  },
};
</script>

<style scoped>
.movie-carousel {
  max-width: 100%;
  overflow: hidden;
  padding: 0 2rem;
}

.carousel-container {
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  gap: 1rem;
  transition: transform 0.5s ease;
  will-change: transform;
}

.movie-card {
  min-width: 230px;
  max-width: 230px;
  background-color: #1f1f1f;
  border-radius: 16px;
  overflow: hidden;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s;
}

.movie-card:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 30px rgba(255, 255, 255, 0.07);
}

.movie-img {
  width: 120px;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 2rem;
  padding: 6px 12px;
  z-index: 10;
  cursor: pointer;
  border-radius: 50%;
  backdrop-filter: blur(4px);
  transition: background 0.3s ease;
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.carousel-btn.left {
  left: 0;
}

.carousel-btn.right {
  right: 0;
}
</style>
