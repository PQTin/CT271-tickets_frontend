import router from "./router"; // Thêm Vue Router
import { createPinia } from "pinia"; // Thêm Pinia
import axios from "axios"; // Cấu hình API toàn cục
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import Toast, { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(Toast);

axios.defaults.baseURL = "/api";

app.mount("#app");
