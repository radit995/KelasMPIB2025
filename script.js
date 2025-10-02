// ==============================
// Toggle Mobile Nav
// ==============================
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

hamburger.addEventListener("click", () => {
  mobileNav.style.display = mobileNav.style.display === "flex" ? "none" : "flex";
});

// ==============================
// Konfigurasi User
// ==============================
const users = {
  "mpiadmin@gmail.com": { password: "KELASMPIB2025", role: "admin" },
  "mpiuser@gmail.com": { password: "KELASMPIB2025", role: "user" },
};

// ==============================
// Fungsi Login / Logout
// ==============================
function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}

function getUserEmail() {
  return localStorage.getItem("userEmail");
}

function getUserRole() {
  return localStorage.getItem("userRole");
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  window.location.href = "login.html";
}

// ==============================
// Event DOM Loaded
// ==============================
document.addEventListener("DOMContentLoaded", function () {
  const userInfo = document.getElementById("user-info");

  const loginBtns = [
    document.getElementById("login-btn-desktop"),
    document.getElementById("login-btn-mobile"),
  ];
  const logoutBtns = [
    document.getElementById("logout-btn-desktop"),
    document.getElementById("logout-btn-mobile"),
  ];

  const currentPage = window.location.pathname.split("/").pop();

  // Tambahkan event logout ke semua tombol logout
  logoutBtns.forEach(btn => {
    if (btn) btn.addEventListener("click", logout);
  });

  if (isLoggedIn()) {
    const email = getUserEmail();
    const role = getUserRole();

    if (userInfo) userInfo.textContent = `👤 ${email} (${role})`;

    loginBtns.forEach(btn => { if (btn) btn.style.display = "none"; });
    logoutBtns.forEach(btn => { if (btn) btn.style.display = "inline-block"; });
  } else {
    if (userInfo) userInfo.textContent = "";

    loginBtns.forEach(btn => { if (btn) btn.style.display = "inline-block"; });
    logoutBtns.forEach(btn => { if (btn) btn.style.display = "none"; });

    // kalau buka selain login.html dan belum login → redirect
    if (currentPage !== "login.html") {
      window.location.href = "login.html";
    }
  }
});

// ==============================
// Validasi Login (untuk login.html)
// ==============================
function validateLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (users[email] && users[email].password === password) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", users[email].role);
    window.location.href = "index.html";
  } else {
    alert("Email atau password salah!");
  }
}

// ==============================
// Auto Logout (20 menit idle)
// ==============================
let idleTime = 0;
const batasWaktu = 1200; // 20 menit = 1200 detik

function resetIdleTime() {
  idleTime = 0;
}

function startIdleTimer() {
  setInterval(() => {
    idleTime++;
    if (idleTime >= batasWaktu) {
      alert("Tidak ada aktivitas selama 20 menit, Anda otomatis logout!");
      logout();
    }
  }, 1000);

  // deteksi aktivitas PC & HP
  document.onmousemove = resetIdleTime;
  document.onkeypress = resetIdleTime;
  document.onclick = resetIdleTime;
  document.onscroll = resetIdleTime;
  document.ontouchstart = resetIdleTime; // sentuhan HP
}

// ==============================
// Jalankan Setelah Halaman Dimuat
// ==============================
document.addEventListener("DOMContentLoaded", function () {
  const userInfo = document.getElementById("user-info");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const mobileLogoutBtn = document.getElementById("mobile-logout-btn"); // tombol logout di mobile
  const uploadSection = document.getElementById("upload-section"); // khusus admin

  const currentPage = window.location.pathname.split("/").pop();

  if (isLoggedIn()) {
    const email = getUserEmail();
    const role = getUserRole();

    if (userInfo) userInfo.textContent = `👤 ${email} (${role})`;
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (mobileLogoutBtn) mobileLogoutBtn.style.display = "block"; // tampilkan di HP

    // tampilkan fitur admin hanya untuk role admin
    if (uploadSection) {
      uploadSection.style.display = role === "admin" ? "block" : "none";
    }

    // jalankan idle timer
    startIdleTimer();
  } else {
    if (userInfo) userInfo.textContent = "";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (mobileLogoutBtn) mobileLogoutBtn.style.display = "none"; // sembunyikan di HP

    // redirect jika bukan login.html
    if (currentPage !== "login.html") {
      window.location.href = "login.html";
    }
  }
});


// ==============================
// Validasi Login (untuk login.html)
// ==============================
function validateLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (users[email] && users[email].password === password) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", users[email].role);
    window.location.href = "index.html";
  } else {
    alert("Email atau password salah!");
  }
}
