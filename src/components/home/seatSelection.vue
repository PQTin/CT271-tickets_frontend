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
          <div class="movie-info">
            <h5 class="modal-title">Chọn ghế - {{ movieTitle }}</h5>
            <p class="text-white">
              <strong>Ngày chiếu:</strong> {{ showtimeDate }} <br />
              <strong>Giờ chiếu:</strong> {{ showtimeTime }} <br />
              <strong>Giá vé:</strong> {{ price }}
            </p>
          </div>

          <button
            type="button"
            class="btn-close btn-close-custom"
            @click="close"
            aria-label="Close"
          ></button>
        </div>

        <AlertMessage
          :message="alertMessage"
          :type="alertType"
          v-if="alertMessage"
        />
        <div class="modal-body">
          <!-- Màn hình rạp chiếu -->
          <div class="screen text-center mb-4">
            <div class="screen-bar">Màn hình</div>
          </div>

          <!-- Hiển thị các ghế -->
          <div
            class="row justify-content-center"
            style="
              margin-left: 50px;
              margin-right: 50px;
              margin-bottom: 50px;
              margin-top: 30px;
            "
          >
            <div
              class="seat col-2 mb-2"
              v-for="seat in seats"
              :key="seat.id"
              :class="{
                'seat-empty': seat.status === 'empty',
                'seat-booked':
                  seat.status === 'not empty' && seat.user_id !== userId,
                'seat-user-booked':
                  seat.status === 'not empty' && seat.user_id === userId,
                'seat-selected': seat === selectedSeat,
              }"
              @click="selectSeat(seat)"
            >
              <span>{{ seat.seat_number }}</span>
            </div>
          </div>
          <!-- Nút đặt vé -->
          <div v-if="selectedSeat" class="text-center">
            <button
              class="btn btn-outline-light btn-sm"
              @click="bookTicket"
              :disabled="!selectedSeat"
            >
              Đặt vé cho ghế {{ selectedSeat.seat_number }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="show" class="modal-backdrop fade show" @click="close"></div>
</template>

<script>
import { ref, onMounted } from "vue";
import ShowtimeService from "@/services/showtimeService";
import ticketService from "@/services/ticketService";
import { useAuthStore } from "@/store/authStore";
import AlertMessage from "@/components/AlertMessage.vue";
export default {
  components: {
    AlertMessage,
  },
  props: {
    show: Boolean,
    movieTitle: String,
    showtimeDate: String,
    showtimeTime: String,
    showtimeId: Number,
    price: Number,
  },
  emits: ["close"],
  data() {
    return {
      seats: [],
      selectedSeat: null,
      alertMessage: "",
      alertType: "success",
    };
  },
  computed: {
    userId() {
      const authStore = useAuthStore();
      return authStore.userId;
    },
  },
  methods: {
    async fetchSeats() {
      try {
        const response = await ShowtimeService.getSeats(this.showtimeId);
        if (response.success) {
          this.seats = response.data;
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách ghế:", error.message);
      }
    },
    selectSeat(seat) {
      if (seat.status === "empty") {
        this.selectedSeat = seat;
      } else if (seat.status === "not empty" && seat.user_id === this.userId) {
        this.selectedSeat = seat;
      } else {
        this.selectedSeat = null;
      }
    },
    close() {
      this.$emit("close");
    },
    async bookTicket() {
      try {
        const authStore = useAuthStore(); // Sử dụng Pinia store
        const token = authStore.token; // Lấy token từ Pinia store
        const ticketData = {
          seat_id: this.selectedSeat.id,
          showtime_id: this.showtimeId,
          price: this.price,
        };

        const response = await ticketService.bookTicket(ticketData, token);
        if (response.success) {
          this.alertMessage = "Đặt vé thành công!";
          this.alertType = "success";
          setTimeout(() => {
            this.alertMessage = "";
            this.close();
          }, 3000);
        } else {
          this.alertMessage = "Lỗi khi đặt vé.";
          this.alertType = "error";
          setTimeout(() => {
            this.alertMessage = "";
          }, 3000);
        }
      } catch (error) {
        alert("Vui lòng đăng nhập để đặt vé!!!");
      }
    },
  },
  mounted() {
    this.fetchSeats();
  },
};
</script>

<style scoped>
.modal-content {
  background-color: #121212;
  color: white;
  border-radius: 8px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #444;
  padding: 15px;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #f8f9fa;
}
.movie-info p {
  font-size: 1rem;
  color: #f8f9fa;
  margin: 0;
}

.movie-info strong {
  font-weight: bold;
}

.modal-body {
  background-color: #121212;
  padding: 20px;
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.7);
}

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

.btn-close-custom:hover {
  background-color: red;
  transform: scale(1.2);
}

.screen-bar {
  display: inline-block;
  background-color: #444;
  color: white;
  padding: 5px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.movie-info h2 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #f8f9fa;
  margin-bottom: 10px;
}

.movie-info p {
  font-size: 1.1rem;
  color: #f8f9fa;
}

.movie-info strong {
  font-weight: bold;
}

.seat-empty {
  background-color: white;
  border: 2px solid #ccc;
  cursor: pointer;
  transition: background-color 0.3s;
}

.seat-empty:hover {
  background-color: #ffeb3b;
}

.seat-booked {
  background-color: #0c0b0b;
  cursor: not-allowed;
}
.seat-selected {
  background-color: #ffeb3b;
}
.seat-user-booked {
  background-color: #0aae7a;
  cursor: not-allowed;
}
.screen {
  background-color: #444;
  width: 100%;
  height: 50px;
  border-top-right-radius: 100%;
  border-top-left-radius: 100%;
}

/* Điều chỉnh bố cục ghế */
.row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

/* Điều chỉnh khoảng cách cho ghế */
.seat {
  margin: 5px;
  text-align: center;
  padding: 20px;
}

.seat span {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}
</style>
