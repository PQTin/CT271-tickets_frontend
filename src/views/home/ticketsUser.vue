<template>
  <Header />
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-white flex-grow-1">Danh Sách Vé Của Bạn</h2>
      <div class="input-group" style="width: 350px">
        <input
          type="text"
          v-model="searchQuery"
          class="form-control"
          placeholder="Tìm theo tên vé, trạng thái, ngày chiếu"
        />
        <button class="btn btn-primary">🔍</button>
      </div>
    </div>

    <div class="row justify-content-center">
      <div
        v-for="ticket in filteredTickets"
        :key="ticket.id"
        class="col-md-4 col-lg-3 mb-4"
      >
        <div
          class="card ticket-card"
          :class="{ 'expanded-ticket-card': selectedTicketId === ticket.id }"
        >
          <div class="ticket-content">
            <div class="ticket-image">
              <img
                :src="`http://localhost:5000${ticket.Showtime.Movie.poster_url}`"
                class="card-img-top"
                alt="Poster phim"
              />
            </div>
            <transition name="slide-fade">
              <div v-if="selectedTicketId === ticket.id" class="ticket-details">
                <p><strong>Phòng:</strong> {{ ticket.Seat.Room.name }}</p>
                <p>
                  <strong>Vị trí ghế:</strong> {{ ticket.Seat.seat_number }}
                </p>
                <p>
                  <strong>Giờ chiếu:</strong>
                  {{
                    new Date(ticket.Showtime.start_time).toLocaleString("vi-VN")
                  }}
                </p>
                <p><strong>Giá vé:</strong> {{ ticket.price }} VND</p>
              </div>
            </transition>
          </div>
          <div class="card-body text-center">
            <h4 class="movie-title">{{ ticket.Showtime.Movie.name }}</h4>
            <p>
              <span :class="getStatusClass(ticket.status)">
                {{ ticket.status }}
              </span>
            </p>
            <button
              class="btn btn-outline-light btn-sm mt-2 me-2"
              @click="toggleDetails(ticket.id)"
            >
              {{ selectedTicketId === ticket.id ? "Thu gọn" : "Chi tiết" }}
            </button>
            <button
              v-if="ticket.status === 'unused'"
              class="btn btn-danger btn-sm mt-2"
              @click="cancelTicket(ticket.id)"
            >
              Hủy vé
            </button>
            <button
              v-if="['refunded', 'expired', 'used'].includes(ticket.status)"
              class="btn btn-outline-danger btn-sm mt-2"
              @click="deleteTicket(ticket.id)"
            >
              Xóa vé
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Tickets Available -->
    <div v-if="tickets.length === 0" class="alert alert-info text-center">
      Bạn chưa có vé nào.
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/store/authStore"; // Import store
import ticketService from "@/services/ticketService"; // Import ticket service
import { useToast } from "vue-toastification"; // Import toast
import Header from "@/components/home/header.vue";

export default defineComponent({
  components: {
    Header,
  },
  setup() {
    const authStore = useAuthStore(); // Access auth store
    const tickets = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const selectedTicketId = ref(null);
    const toast = useToast(); // Initialize toast
    const searchQuery = ref("");

    const getTickets = async () => {
      loading.value = true;
      error.value = null;
      try {
        // Gọi API lấy vé của người dùng
        const data = await ticketService.getUserTickets(authStore.token);
        tickets.value = data.data;
      } catch (err) {
        error.value = err.message || "Lỗi khi lấy thông tin vé.";
      } finally {
        loading.value = false;
      }
    };
    // Hàm tìm kiếm các vé theo nhiều từ khóa
    const filteredTickets = computed(() => {
      if (!searchQuery.value) return tickets.value;

      const queryParts = searchQuery.value
        .split(",")
        .map((part) => part.trim().toLowerCase());
      return tickets.value.filter((ticket) => {
        const movieName = ticket.Showtime.Movie.name.toLowerCase();
        const ticketStatus = ticket.status.toLowerCase();
        const showtime = new Date(ticket.Showtime.start_time);
        const showtimeString = showtime.toLocaleString().toLowerCase();

        // Kiểm tra nếu bất kỳ từ khóa nào khớp với tên phim, trạng thái, hoặc giờ chiếu
        return queryParts.every((query) => {
          const isDate = /\d{1,2}\/\d{1,2}\/\d{4}/.test(query); // Kiểm tra định dạng dd/mm/yyyy
          const isDayMonth = /\d{1,2}\/\d{1,2}$/.test(query); // kiểm tra dd/mm
          if (isDate) {
            const [day, month, year] = query
              .split("/")
              .map((num) => parseInt(num, 10));
            const searchDate = new Date(year, month - 1, day); // Chuyển chuỗi thành Date
            return (
              showtime.getDate() === searchDate.getDate() &&
              showtime.getMonth() === searchDate.getMonth() &&
              showtime.getFullYear() === searchDate.getFullYear()
            );
          } else if (isDayMonth) {
            const [day, month] = query
              .split("/")
              .map((num) => parseInt(num, 10));
            return (
              showtime.getDate() === day && showtime.getMonth() === month - 1
            );
          }
          return (
            movieName.includes(query) ||
            ticketStatus.includes(query) ||
            showtimeString.includes(query)
          );
        });
      });
    });

    const getStatusClass = (status) => {
      switch (status) {
        case "used":
          return "text-success";
        case "expired":
          return "text-danger";
        case "unused":
          return "text-warning";
        case "refunded":
          return "text-muted";
        default:
          return "";
      }
    };

    const toggleDetails = (ticketId) => {
      // Toggle details when clicking on "Chi tiết"
      if (selectedTicketId.value === ticketId) {
        selectedTicketId.value = null; // Thu gọn nếu đã mở
      } else {
        selectedTicketId.value = ticketId; // Mở chi tiết
      }
    };

    const cancelTicket = async (ticketId) => {
      const confirmCancel = confirm("Bạn có chắc chắn muốn hủy vé này?");
      if (!confirmCancel) return;
      try {
        const ticket = tickets.value.find((ticket) => ticket.id === ticketId);
        const currentTime = new Date();
        const showtime = new Date(ticket.Showtime.start_time); // Lấy giờ chiếu của vé
        const timeDifference = (showtime - currentTime) / 1000 / 60 / 60; // Tính sự chênh lệch thời gian (tính theo giờ)

        if (timeDifference < 6) {
          toast.error("Không thể hủy vé vì vé sắp đến giờ chiếu.");
          return;
        }

        // Gọi API hủy vé
        await ticketService.cancelTicket(ticketId, authStore.token);
        // Reload tickets sau khi hủy
        await getTickets();
        toast.success("Vé đã được hủy thành công.");
      } catch (err) {
        toast.error("Lỗi khi hủy vé: " + (err.message || err));
      }
    };
    const deleteTicket = async (ticketId) => {
      const confirmDelete = confirm("Bạn có chắc chắn muốn xóa vé này?");
      if (!confirmDelete) return;
      try {
        await ticketService.deleteTicket(ticketId, authStore.token); // gọi API xoá (bạn cần viết hàm này trong backend nữa)
        await getTickets(); // load lại vé sau khi xoá
        toast.success("Đã xoá vé.");
      } catch (err) {
        toast.error("Lỗi khi xoá vé: " + (err.message || err));
      }
    };

    onMounted(() => {
      getTickets();
    });

    return {
      cancelTicket,
      tickets,
      loading,
      error,
      getStatusClass,
      toggleDetails,
      selectedTicketId,
      searchQuery,
      filteredTickets,
      deleteTicket,
    };
  },
});
</script>

<style scoped>
.container {
  margin-top: 100px;
}

.ticket-card {
  min-height: 500px;
  border-radius: 12px;
  overflow: hidden;
  background: #222;
  color: white;
  padding: 10px;
  box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease-in-out;
}

.expanded-ticket-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
}

.ticket-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease-in-out;
}

.ticket-image img {
  width: 250px;
  height: 360px;
  object-fit: cover;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}

.expanded-ticket-card .ticket-image img {
  width: 180px;
  height: 260px;
}

.movie-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #f8f9fa; /* Màu sáng hơn để nổi bật */
}

.ticket-details {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.ticket-details button {
  display: block;
  margin: 10px auto 0;
}

.expanded-ticket-card .ticket-details {
  opacity: 1;
  max-height: 200px;
  padding: 10px;
}

/* Status colors */
.text-muted {
  color: #6c757d !important;
}

.text-success {
  color: #28a745 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}
</style>
