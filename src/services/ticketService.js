import axios from "axios";

const API_URL = "/api/tickets";

const ticketService = {
  getAllTickets: async (token) => {
    const response = await axios.get(`${API_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getUserTickets: async (token) => {
    const response = await axios.get(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  bookTicket: async (ticketData, token) => {
    const response = await axios.post(`${API_URL}/book`, ticketData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  cancelTicket: async (id, token) => {
    const response = await axios.put(
      `${API_URL}/cancel/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  deleteTicket: async (id, token) => {
    const response = await axios.delete(`${API_URL}/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateTicketStatus: async (id, token) => {
    const response = await axios.put(
      `${API_URL}/update/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};

export default ticketService;
