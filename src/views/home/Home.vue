<template>
  <div>
    <Header />
    <Sidebar />
    <ShowtimesNext7 />
  </div>
</template>

<script>
import Header from "@/components/home/header.vue";
import Sidebar from "@/components/home/sidebar.vue";
import ShowtimesNext7 from "@/components/home/showtimesNext7.vue";
export default {
  components: {
    Header,
    Sidebar,
    ShowtimesNext7,
  },
};
</script>
<style scoped></style>
