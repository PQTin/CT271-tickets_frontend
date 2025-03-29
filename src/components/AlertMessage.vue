<template>
  <div v-if="visible" :class="alertClass" role="alert">
    {{ message }}
  </div>
</template>

<script setup>
import { computed, watch, ref } from "vue";

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: "success", // Mặc định là thông báo thành công
    validator: (value) => ["success", "error"].includes(value),
  },
});

const visible = ref(false);
const localMessage = ref(props.message);
const localType = ref(props.type);

const alertClass = computed(() => {
  return localType.value === "success"
    ? "alert alert-success"
    : "alert alert-danger";
});

// Theo dõi message, hiển thị và ẩn sau 3 giây
watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      localMessage.value = newMessage;
      localType.value = props.type;
      visible.value = true;
      setTimeout(() => {
        visible.value = false;
        localMessage.value = "";
        localType.value = "success";
      }, 3000);
    }
  },
  { immediate: true } // Gọi ngay khi component được render
);
</script>
