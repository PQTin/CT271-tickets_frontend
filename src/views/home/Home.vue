<template>
  <div>
    <Header />
    <Sidebar />
  </div>
</template>

<script>
import Header from "@/components/home/header.vue";
import Sidebar from "@/components/home/sidebar.vue";

export default {
  components: {
    Header,
    Sidebar,
  },
};
</script>
<style scoped></style>
