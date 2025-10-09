// ==============================
// KONFIGURASI USER LOGIN
// ==============================
const users = {
  "mpiadmin@gmail.com": { password: "AdminMPIB2025", role: "admin" },
  "mpiuser@gmail.com": { password: "UserMPIB2025", role: "user" },
};

// ==============================
// FUNGSI LOGIN & LOGOUT
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
// VALIDASI LOGIN (UNTUK login.html)
// ==============================
function validateLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (users[email] && users[email].password === password) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", users[email].role);
    alert("Login berhasil!");
    window.location.href = "index.html";
  } else {
    alert("Email atau password salah!");
  }
}

// ==============================
// STATUS LOGIN + NAVBAR
// ==============================
document.addEventListener("DOMContentLoaded", function () {
  const userInfo = document.getElementById("user-info");
  const loginDesktop = document.getElementById("login-btn-desktop");
  const logoutDesktop = document.getElementById("logout-btn-desktop");
  const loginMobile = document.getElementById("login-btn-mobile");
  const logoutMobile = document.getElementById("logout-btn-mobile");
  const uploadSection = document.querySelector(".upload-section");

  const page = window.location.pathname.split("/").pop();

  if (isLoggedIn()) {
    const email = getUserEmail();
    const role = getUserRole();

    if (userInfo) userInfo.textContent = `👤 ${email} (${role})`;
    if (loginDesktop) loginDesktop.style.display = "none";
    if (logoutDesktop) logoutDesktop.style.display = "inline-block";
    if (loginMobile) loginMobile.style.display = "none";
    if (logoutMobile) logoutMobile.style.display = "inline-block";

    if (uploadSection) uploadSection.style.display = role === "admin" ? "block" : "none";

    loadMakalahTable();
  } else {
    if (page !== "login.html") {
      window.location.href = "login.html";
    }

    if (userInfo) userInfo.textContent = "";
    if (loginDesktop) loginDesktop.style.display = "inline-block";
    if (logoutDesktop) logoutDesktop.style.display = "none";
    if (loginMobile) loginMobile.style.display = "inline-block";
    if (logoutMobile) logoutMobile.style.display = "none";
  }

  if (logoutDesktop) logoutDesktop.addEventListener("click", logout);
  if (logoutMobile) logoutMobile.addEventListener("click", logout);
});

// ==============================
// DATA MAKALAH
// ==============================
let editIndex = null;

document.addEventListener("DOMContentLoaded", loadMakalahTable);

document.getElementById("makalahForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const judul = document.getElementById("judul").value.trim();
  const kelompok = document.getElementById("kelompok").value.trim();
  const tanggal = document.getElementById("tanggal").value;
  const pertemuan = document.getElementById("pertemuan").value;
  const file = document.getElementById("file").files[0];

  if (!judul || !kelompok || !tanggal || !pertemuan) {
    alert("Lengkapi semua data terlebih dahulu!");
    return;
  }

  let data = JSON.parse(localStorage.getItem("makalahData")) || [];

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  let fileData = null;
  if (file) fileData = await toBase64(file);

  if (editIndex !== null) {
    const existing = data[editIndex];
    data[editIndex] = {
      judul,
      kelompok,
      tanggal,
      pertemuan,
      fileName: file ? file.name : existing.fileName,
      fileData: file ? fileData : existing.fileData
    };
    alert("✅ Data makalah berhasil diperbarui!");
    editIndex = null;
  } else {
    if (!file) {
      alert("Pilih file makalah terlebih dahulu!");
      return;
    }
    data.push({
      judul,
      kelompok,
      tanggal,
      pertemuan,
      fileName: file.name,
      fileData
    });
    alert("✅ Makalah baru berhasil ditambahkan!");
  }

  localStorage.setItem("makalahData", JSON.stringify(data));
  this.reset();
  loadMakalahTable();
});

function loadMakalahTable() {
  const tableBody = document.querySelector("#makalahTable tbody");
  if (!tableBody) return;
  const data = JSON.parse(localStorage.getItem("makalahData")) || [];

  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6">Belum ada makalah diunggah.</td></tr>`;
    return;
  }

  const role = getUserRole();

  data.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.judul}</td>
      <td>${item.kelompok}</td>
      <td>${item.tanggal}</td>
      <td>${item.pertemuan}</td>
      <td>${item.fileName}</td>
      <td class="action-buttons">
        <button class="lihat-btn"><i class="fa fa-eye"></i></button>
        <button class="download-btn"><i class="fa fa-download"></i></button>
        ${role === "admin" ? `<button class="edit-btn"><i class="fa fa-pen"></i></button>
        <button class="delete-btn"><i class="fa fa-trash"></i></button>` : ""}
      </td>
    `;

    row.querySelector(".lihat-btn").addEventListener("click", () => {
      const nameParam = encodeURIComponent(item.fileName);
      window.location.href = `lihat.html?name=${nameParam}`;
    });

    row.querySelector(".download-btn").addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = item.fileData;
      a.download = item.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    if (role === "admin") {
      row.querySelector(".edit-btn").addEventListener("click", () => {
        document.getElementById("judul").value = item.judul;
        document.getElementById("kelompok").value = item.kelompok;
        document.getElementById("tanggal").value = item.tanggal;
        document.getElementById("pertemuan").value = item.pertemuan;
        editIndex = index;
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      row.querySelector(".delete-btn").addEventListener("click", () => {
        if (confirm("Yakin ingin menghapus makalah ini?")) {
          data.splice(index, 1);
          localStorage.setItem("makalahData", JSON.stringify(data));
          loadMakalahTable();
        }
      });
    }

    tableBody.appendChild(row);
  });
}

// ==============================
// AUTO LOGOUT 20 MENIT
// ==============================
let waktuKunjungan = 20 * 60; 

function mulaiTimerKunjungan() {
  const hitungMundur = setInterval(() => {
    waktuKunjungan--;
    if (waktuKunjungan <= 0) {
      clearInterval(hitungMundur);
      alert("Waktu kunjungan Anda (20 menit) telah berakhir. Anda akan logout otomatis.");
      logout();
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
  if (isLoggedIn()) {
    mulaiTimerKunjungan();

    // reset timer jika ada aktivitas
    ["mousemove","keydown","click","scroll"].forEach(evt => {
      document.addEventListener(evt, () => waktuKunjungan = 20*60);
    });
  }
});

// ==============================
// MOBILE NAV TOGGLE
// ==============================
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      mobileNav.classList.toggle("active");
    });
  }
});
