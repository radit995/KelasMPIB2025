// ==============================
// LIHAT MAKALAH (versi final bersih + info detail)
// ==============================

// Ambil parameter ID dari URL
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));
if (!id) {
  document.getElementById("statusText").textContent = "❌ ID makalah tidak ditemukan.";
  throw new Error("Parameter ID tidak valid");
}

let db;
const dbName = "DB_DasarAkuntansi"; // ⚠️ ganti sesuai nama database mata kuliah

// ==============================
// Buka IndexedDB
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const request = indexedDB.open(dbName, 1);

  request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains("makalahData")) {
      db.createObjectStore("makalahData", { keyPath: "id", autoIncrement: true });
    }
  };

  request.onsuccess = (e) => {
    db = e.target.result;
    loadMakalah();
  };

  request.onerror = (e) => {
    console.error("❌ Gagal membuka IndexedDB:", e.target.error);
    document.getElementById("statusText").textContent = "❌ Gagal membuka database.";
  };
});

// ==============================
// Ambil data makalah dan tampilkan
// ==============================
function loadMakalah() {
  const tx = db.transaction("makalahData", "readonly");
  const store = tx.objectStore("makalahData");
  const req = store.get(id);

  req.onsuccess = () => {
    const data = req.result;
    const statusText = document.getElementById("statusText");
    const infoPertemuan = document.getElementById("infoPertemuan");
    const fileContainer = document.getElementById("fileContainer");

    if (!data) {
      statusText.textContent = "❌ File tidak ditemukan di database.";
      return;
    }

    // 🟢 Hapus teks loading
    statusText.textContent = "";

    // ==============================
    // Info makalah tampil rapi
    // ==============================
    infoPertemuan.innerHTML = `
      <div class="makalah-info" style="padding:15px;max-width:600px;margin:auto;text-align:left;">
        <h3 style="margin-bottom:8px;color:#111;">${data.judul}</h3>
        <p><strong>Kelompok:</strong> ${data.kelompok}</p>
        <p><strong>Tanggal:</strong> ${data.tanggal}</p>
        <p><strong>Pertemuan:</strong> ${data.pertemuan}</p>
        <p><strong>Nama File:</strong> ${data.fileName}</p>
        <button id="downloadBtn" style="margin-top:12px;padding:10px 18px;background:#1d4ed8;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;">⬇️ Download File</button>
      </div>
    `;

    // ==============================
    // Preview file
    // ==============================
    fileContainer.innerHTML = "";
    const ext = data.fileName.split(".").pop().toLowerCase();

    if (ext === "pdf") {
      const embed = document.createElement("embed");
      embed.src = data.fileData;
      embed.type = "application/pdf";
      embed.width = "100%";
      embed.height = "600px";
      embed.style.borderRadius = "10px";
      embed.style.marginTop = "20px";
      fileContainer.appendChild(embed);
    }

    // ==============================
    // Tombol download
    // ==============================
    document.getElementById("downloadBtn").addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = data.fileData;
      a.download = data.fileName;
      a.click();
    });
  };

  req.onerror = (e) => {
    console.error("❌ Gagal mengambil data:", e.target.error);
    document.getElementById("statusText").textContent = "❌ Gagal memuat file makalah.";
  };
}
