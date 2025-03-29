<template>
  <div>
    <h1>Trang Chủ</h1>
    <Login />
  </div>
</template>

<script>
import Login from "@/components/auth/Login.vue";
import Register from "@/components/auth/Register.vue";

export default {
  components: {
    Login,
    Register,
  },
};
</script>
