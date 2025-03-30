<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>{{ isEdit ? "Cập nhật Phim" : "Thêm Phim" }}</h3>
      <AlertMessage
        v-if="alertMessage"
        :message="alertMessage"
        :type="alertType"
      />

      <form @submit.prevent="submitForm">
        <!-- Tên phim -->
        <div class="mb-3">
          <label class="form-label">Tên Phim</label>
          <input
            v-model="movie.name"
            type="text"
            class="form-control"
            required
          />
        </div>

        <!-- Thể loại & Thời lượng -->
        <div class="row mb-3">
          <div class="col">
            <label class="form-label">Thể Loại</label>
            <input
              v-model="movie.genre"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="col">
            <label class="form-label">Thời Lượng (phút)</label>
            <input
              v-model="movie.duration"
              type="number"
              class="form-control"
              required
            />
          </div>
        </div>

        <!-- Ngày phát hành -->
        <div class="mb-3">
          <label class="form-label">Ngày Phát Hành</label>
          <input
            v-model="movie.release_date"
            type="date"
            class="form-control"
            required
          />
        </div>
        <!-- Mô tả -->
        <div class="mb-3">
          <label class="form-label">Mô Tả</label>
          <textarea
            v-model="movie.description"
            class="form-control"
            rows="3"
            required
          ></textarea>
        </div>
        <!-- URL trailer -->
        <div class="mb-3">
          <label class="form-label">Trailer URL</label>
          <input v-model="movie.trailer_url" type="url" class="form-control" />
        </div>

        <!-- Ảnh poster -->
        <div class="mb-3">
          <label class="form-label">Poster</label>
          <input
            type="file"
            @change="handleFileUpload"
            class="form-control"
            accept="image/*"
          />
          <img
            v-if="movie.poster_url"
            :src="`http://localhost:5000${movie.poster_url}`"
            alt="Poster"
            width="50"
            class="preview-image"
          />
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-success">
            {{ isEdit ? "Cập nhật" : "Thêm" }}
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import movieService from "@/services/movieService";
import AlertMessage from "@/components/AlertMessage.vue";

const props = defineProps({
  movieData: Object,
  isEdit: Boolean,
  token: String,
});

const emit = defineEmits(["close", "saved"]);
const movie = ref({ ...props.movieData });
const alertMessage = ref("");
const alertType = ref("success");

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    movie.value.poster = file;
  }
};

const submitForm = async () => {
  try {
    const formData = new FormData();
    for (const key in movie.value) {
      formData.append(key, movie.value[key]);
    }

    if (props.isEdit) {
      await movieService.updateMovie(movie.value.id, formData, props.token);
      alertMessage.value = "Cập nhật phim thành công";
    } else {
      await movieService.createMovie(formData, props.token);
      alertMessage.value = "Thêm phim mới thành công";
    }
    alertType.value = "success";

    setTimeout(() => {
      alertMessage.value = "";
      emit("saved");
      emit("close");
    }, 3000);
  } catch (error) {
    alertMessage.value = error.message || "Đã có lỗi xảy ra";
    alertType.value = "error";
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 450px;
}
.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>
