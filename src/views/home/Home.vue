<template>
  <div>
    <Header />
    <Sidebar />
    <ShowtimesNext7 />

    <hr class="divider" />

    <h1 class="main-title">Danh sách phim theo thể loại</h1>
    <section class="genre-section">
      <h2 class="genre-title">Hành động</h2>
      <MoviesByGenre :genre="'Action'" />

      <h2 class="genre-title">Hài</h2>
      <MoviesByGenre :genre="'Comedy'" />

      <h2 class="genre-title">Kinh dị</h2>
      <MoviesByGenre :genre="'Horror'" />

      <h2 class="genre-title">Hoạt hình</h2>
      <MoviesByGenre :genre="'Children'" />
    </section>
  </div>
</template>

<script>
import Header from "@/components/home/header.vue";
import Sidebar from "@/components/home/sidebar.vue";
import ShowtimesNext7 from "@/components/home/showtimesNext7.vue";
import MoviesByGenre from "@/components/home/getMoviesByGenre.vue";
export default {
  components: {
    Header,
    Sidebar,
    ShowtimesNext7,
    MoviesByGenre,
  },
};
</script>
<style scoped>
.main-title {
  color: white;
  font-size: 2rem;
  text-align: center;
  margin-top: 2rem;
}
.divider {
  border: none;
  height: 2px;
  background-color: white;
  margin: 2rem 0;
}

.genre-section {
  padding: 0 2rem;
}

.genre-title {
  color: white;
  margin: 2rem 0 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
