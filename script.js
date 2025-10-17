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
// VALIDASI LOGIN
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

    if (page === "makalah.html") {
      if (email === "mpiuser@gmail.com" || email === "mpiadmin@gmail.com") {
        loadMakalahTable();
      } else {
        alert("Anda tidak memiliki akses ke halaman ini!");
        window.location.href = "login.html";
      }
    }

    // sembunyikan upload jika user biasa
    if (uploadSection && role !== "admin") {
      uploadSection.style.display = "none";
    }
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
// LOAD DATA MAKALAH
// ==============================
function loadMakalahTable() {
  const transaction = db.transaction("makalahData", "readonly");
  const store = transaction.objectStore("makalahData");
  const request = store.getAll();

  request.onsuccess = (e) => {
    const makalahData = e.target.result;
    const tableBody = document.getElementById("makalahTableBody");
    tableBody.innerHTML = "";

    const role = getUserRole();

    makalahData.forEach((data) => {
      const row = document.createElement("tr");

      // Tombol aksi — Edit & Hapus hanya admin
      let actionButtons = `
        <button class="lihat-btn" onclick="lihatMakalah(${data.id})">Lihat</button>
        <button class="download-btn" onclick="downloadMakalah(${data.id})">Download</button>
      `;

      if (role === "admin") {
        actionButtons += `
          <button class="edit-btn" onclick="editMakalah(${data.id})">Edit</button>
          <button class="hapus-btn" onclick="hapusMakalah(${data.id})">Hapus</button>
        `;
      }

      row.innerHTML = `
        <td>${data.judul}</td>
        <td>${data.kelompok}</td>
        <td>${data.tanggal || "-"}</td>
        <td>${actionButtons}</td>
      `;

      tableBody.appendChild(row);
    });
  };
}

// ==============================
// FUNGSI EDIT (ADMIN ONLY)
// ==============================
function editMakalah(id) {
  const role = getUserRole();
  if (role !== "admin") {
    alert("❌ Anda tidak memiliki izin untuk mengedit makalah!");
    return;
  }
  window.location.href = `edit.html?id=${id}`;
}

// ==============================
// FUNGSI HAPUS (ADMIN ONLY)
// ==============================
function hapusMakalah(id) {
  const role = getUserRole();

  // Cegah akses non-admin meskipun lewat console
  if (role !== "admin" || getUserEmail() !== "mpiadmin@gmail.com") {
    alert("❌ Anda tidak memiliki izin untuk menghapus makalah!");
    return;
  }

  if (confirm("Yakin ingin menghapus makalah ini?")) {
    const transaction = db.transaction("makalahData", "readwrite");
    const store = transaction.objectStore("makalahData");
    store.delete(id);

    transaction.oncomplete = () => {
      alert("✅ Makalah berhasil dihapus!");
      loadMakalahTable();
    };
  }
}

// ==============================
// FUNGSI UPLOAD (ADMIN ONLY)
// ==============================
function uploadMakalah(judul, kelompok, tanggal, fileUrl) {
  const role = getUserRole();

  if (role !== "admin" || getUserEmail() !== "mpiadmin@gmail.com") {
    alert("❌ Hanya admin yang dapat mengupload makalah!");
    return;
  }

  const transaction = db.transaction("makalahData", "readwrite");
  const store = transaction.objectStore("makalahData");
  const newData = {
    id: Date.now(),
    judul,
    kelompok,
    tanggal,
    fileUrl,
  };

  store.add(newData);
  transaction.oncomplete = () => {
    alert("✅ Makalah berhasil diupload!");
    loadMakalahTable();
  };
}

// ==============================
// DOWNLOAD & LIHAT
// ==============================
function downloadMakalah(id) {
  const transaction = db.transaction("makalahData", "readonly");
  const store = transaction.objectStore("makalahData");
  const request = store.get(id);

  request.onsuccess = (e) => {
    const data = e.target.result;
    if (data && data.fileUrl) {
      const a = document.createElement("a");
      a.href = data.fileUrl;
      a.download = data.judul;
      a.click();
    }
  };
}

function lihatMakalah(id) {
  window.location.href = `lihat.html?id=${id}`;
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



