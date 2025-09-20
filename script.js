// Toggle Mobile Nav
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
// Fungsi Cek Login
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

// ==============================
// Fungsi Logout
// ==============================
function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  window.location.href = "login.html";
}

// ==============================
// Jalankan Setelah Halaman Dimuat
// ==============================
document.addEventListener("DOMContentLoaded", function () {
  const userInfo = document.getElementById("user-info");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const uploadSection = document.getElementById("upload-section"); // khusus admin

  const currentPage = window.location.pathname.split("/").pop();

  if (isLoggedIn()) {
    const email = getUserEmail();
    const role = getUserRole();

    if (userInfo) userInfo.textContent = `👤 ${email} (${role})`;
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";

    // tampilkan fitur admin hanya untuk role admin
    if (uploadSection) {
      uploadSection.style.display = role === "admin" ? "block" : "none";
    }
  } else {
    if (userInfo) userInfo.textContent = "";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";

    // hanya redirect kalau buka selain login.html
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


