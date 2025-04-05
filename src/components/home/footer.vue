<template>
  <div class="page-wrapper">
    <footer class="bg-dark text-white pt-4 pb-3">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-4 mb-3 text-center text-md-start">
            <h1 class="logo text-warning">TicketMovie</h1>
            <div class="col-12 text-center text-md-start">
              <p class="mb-0">© 2025 Đại học Cần Thơ</p>
            </div>
          </div>

          <div class="col-md-4 mb-3 text-center">
            <h5 class="text-uppercase mb-2">Liên Hệ</h5>
            <ul class="list-unstyled">
              <li>
                <a
                  href="mailto:tinb2111867@student.ctu.edu.vn"
                  class="text-white text-decoration-none"
                >
                  <i class="bi bi-envelope-fill"></i> Email:
                  tinb2111867@student.ctu.edu.vn
                </a>
              </li>
              <li>
                <a
                  href="tel:+84921212276"
                  class="text-white text-decoration-none"
                >
                  <i class="bi bi-telephone-fill"></i> Số điện thoại: 0921212276
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps?q=Khu+II,+Đ.+3+Tháng+2,+Xuân+Khánh,+Ninh+Kiều,+Cần+Thơ"
                  target="_blank"
                  class="text-white text-decoration-none"
                >
                  <i class="bi bi-geo-alt-fill"></i> Địa chỉ: Khu II, Đường 3
                  Tháng 2, Phường Xuân Khánh, Quận Ninh Kiều, TP Cần Thơ
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script></script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
}

.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 40vh;
}

footer {
  background-color: #212529;
  margin-top: auto;
}

footer a:hover {
  text-decoration: underline;
}

footer .bi {
  margin-right: 8px;
}

footer .logo {
  font-size: 2rem;
  font-weight: bold;
  color: #ffc107;
}
</style>
