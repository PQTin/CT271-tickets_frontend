<template>
  <Header />

  <div class="content-wrapper">
    <Login />
  </div>

  <Footer />
</template>

<script>
import Header from "@/components/home/header.vue";
import Login from "@/components/auth/Login.vue";
import Footer from "@/components/home/footer.vue";

export default {
  components: {
    Header,
    Footer,
    Login,
  },
};
</script>

<style scoped>
/* Wrapper chứa nội dung, đảm bảo nội dung chiếm hết không gian còn lại */
.content-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px); /* Giảm chiều cao của header nếu có */
}

footer {
  margin-top: auto;
}
</style>
