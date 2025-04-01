<template>
  <Header />

  <div>
    <Login />
  </div>
</template>

<script>
import Header from "@/components/home/header.vue";
import Login from "@/components/auth/Login.vue";

export default {
  components: {
    Header,
    Login,
  },
};
</script>

<style scoped>
div {
  margin-top: 20px;
  background-color: #121212; /* Màu nền tối */
  color: white; /* Màu chữ trắng để dễ đọc */
  min-height: 100vh; /* Đảm bảo trang phủ kín màn hình */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>
