<template>
  <div
    class="modal fade"
    :class="{ show: show }"
    :style="{ display: show ? 'block' : 'none' }"
    tabindex="-1"
    :aria-hidden="show ? 'false' : 'true'"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">🎬 {{ movieTitle }}</h5>

          <button
            type="button"
            class="btn-close btn-close-custom"
            @click="close"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="ratio ratio-16x9">
            <iframe
              v-if="embedUrl"
              :src="embedUrl"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
            >
            </iframe>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Overlay nền mờ -->
  <div v-if="show" class="modal-backdrop fade show" @click="close"></div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    videoUrl: String,
    movieTitle: String,
  },
  emits: ["close"],
  computed: {
    embedUrl() {
      if (!this.videoUrl) return "";
      const videoId = this.videoUrl.includes("youtu.be/")
        ? this.videoUrl.split("youtu.be/")[1].split("?")[0]
        : this.videoUrl.split("v=")[1]?.split("&")[0];

      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
        : "";
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.btn-close-custom {
  position: absolute;
  right: 15px;
  top: 15px;
  width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 50%;
  opacity: 1;
  transition: all 0.3s ease-in-out;
}

/* Hover để nút X */
.btn-close-custom:hover {
  background-color: red;
  transform: scale(1.2);
}

/* Hiệu ứng mở modal */
.modal.show {
  display: block;
  opacity: 1;
}
/* Chỉnh nền modal và chữ */
.modal-content {
  background-color: #121212;
  color: white;
  border-radius: 8px;
}

.modal-header {
  border-bottom: 1px solid #444;
}

.modal-title {
  color: white;
}

.modal-body {
  background-color: #121212;
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
