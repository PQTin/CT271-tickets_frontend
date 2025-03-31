<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">Quản lý Vé</h2>
      <div class="input-group" style="width: 350px">
        <input
          v-model="searchQuery"
          @input="filterTickets"
          class="form-control"
          placeholder="Tên phim, phòng, email, trạng thái..."
        />
        <button class="btn btn-primary" @click="filterTickets">🔍</button>
      </div>
    </div>

    <AlertMessage
      v-if="alertMessage"
      :message="alertMessage"
      :type="alertType"
    />

    <table class="table table-bordered table-striped" v-if="tickets.length">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Phim</th>
          <th>Email</th>
          <th>Phòng</th>
          <th>Ghế</th>
          <th>Bắt đầu</th>
          <th>Kết thúc</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ticket in filteredTickets" :key="ticket.id">
          <td>{{ ticket.id }}</td>
          <td>{{ ticket.Showtime.Movie.name }}</td>
          <td>{{ ticket.User.email }}</td>
          <td>{{ ticket.Seat.Room.name }}</td>
          <td>{{ ticket.Seat.seat_number }}</td>
          <td>{{ formatDate(ticket.Showtime.start_time) }}</td>
          <td>{{ formatDate(ticket.Showtime.end_time) }}</td>
          <td>{{ formatStatus(ticket.status) }}</td>
          <td>
            <button
              v-if="ticket.status === 'unused'"
              class="btn btn-warning btn-sm me-2"
              @click="updateTicket(ticket.id)"
            >
              Cập nhật
            </button>
            <button
              v-if="ticket.status !== 'unused'"
              class="btn btn-danger btn-sm"
              @click="deleteTicket(ticket.id)"
            >
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-center text-muted">Hiện chưa có vé nào</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import ticketService from "@/services/ticketService";
import AlertMessage from "@/components/AlertMessage.vue";

export default {
  components: { AlertMessage },
  setup() {
    const tickets = ref([]);
    const alertMessage = ref("");
    const searchQuery = ref("");
    const filteredTickets = ref([]);

    const alertType = ref("success");
    const authToken = ref(localStorage.getItem("token"));

    const fetchTickets = async () => {
      try {
        const response = await ticketService.getAllTickets(authToken.value);
        if (response.success) {
          tickets.value = response.data;
          filteredTickets.value = [...response.data];
        } else {
          alertMessage.value = "Lỗi khi tải danh sách vé";
          alertType.value = "error";
        }
      } catch (error) {
        alertMessage.value = "Lỗi kết nối API";
        alertType.value = "error";
      }
    };

    const deleteTicket = async (ticketId) => {
      if (!confirm("Bạn có chắc chắn muốn xóa vé này?")) return;
      try {
        alertMessage.value = "";
        alertType.value = "success";
        await ticketService.deleteTicket(ticketId, authToken.value);
        alertMessage.value = "Xóa vé thành công";
        alertType.value = "success";
        fetchTickets();
      } catch (error) {
        alertMessage.value = error.response?.data?.message || "Lỗi khi xóa vé";
        alertType.value = "error";
      }
    };

    const updateTicket = async (ticketId) => {
      try {
        alertMessage.value = "";
        alertType.value = "success";
        await ticketService.updateTicketStatus(ticketId, authToken.value);
        alertMessage.value = "Cập nhật vé thành công";
        alertType.value = "success";
        fetchTickets();
      } catch (error) {
        alertMessage.value =
          error.response?.data?.message || "Lỗi khi cập nhật vé";
        alertType.value = "error";
      }
    };

    const formatDate = (datetime) => {
      return new Date(datetime).toLocaleString("vi-VN");
    };

    const formatStatus = (status) => {
      const statusMap = {
        unused: "Chưa sử dụng",
        used: "Đã sử dụng",
        expired: "Quá hạn",
        refunded: "Hoàn tiền",
      };
      return statusMap[status] || "Không xác định";
    };
    const filterTickets = () => {
      if (!tickets.value.length) return; // không lọc khi chưa có vé
      const query = searchQuery.value
        .toLowerCase()
        .split(",")
        .map((q) => q.trim());

      filteredTickets.value = tickets.value.filter((ticket) => {
        const ticketValues = [
          ticket.Showtime.Movie.name.toLowerCase(),
          ticket.Seat.Room.name.toLowerCase(),
          ticket.User.email.toLowerCase(),
          formatStatus(ticket.status).toLowerCase(),
        ];

        // Kiểm tra tất cả từ khóa nhập vào đều có trong dữ liệu của vé
        return query.every((q) =>
          ticketValues.some((value) => value.includes(q))
        );
      });
    };

    onMounted(fetchTickets);

    return {
      tickets,
      alertMessage,
      alertType,
      deleteTicket,
      updateTicket,
      formatDate,
      formatStatus,
      filterTickets,
      filteredTickets,
      searchQuery,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 100%;
  margin: 0;
  padding: 0 20px;
}
</style>
