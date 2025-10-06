// Ambil parameter dari URL
const params = new URLSearchParams(window.location.search);
const fileName = params.get("name");

// Elemen halaman
const viewer = document.getElementById("viewer");
const fileInfo = document.getElementById("fileInfo");
const judulFile = document.getElementById("judulFile");
const downloadBtn = document.getElementById("downloadBtn");

// Ambil data dari localStorage
const data = JSON.parse(localStorage.getItem("makalahData")) || [];
const item = data.find(d => d.fileName === fileName);

if (item) {
  document.title = `Lihat Makalah - ${item.fileName}`;
  judulFile.textContent = item.fileName;
  fileInfo.textContent = `Menampilkan: ${item.fileName}`;

  const fileData = item.fileData || item.fileURL;

  // Tampilkan file sesuai jenis
  if (item.fileName.endsWith(".pdf")) {
    viewer.innerHTML = `<iframe src="${fileData}" frameborder="0" style="width:100%;height:80vh;"></iframe>`;
  } else if (item.fileName.endsWith(".doc") || item.fileName.endsWith(".docx")) {
    const encoded = encodeURIComponent(fileData);
    viewer.innerHTML = `
      <iframe src="https://docs.google.com/gview?url=${encoded}&embedded=true"
              frameborder="0" style="width:100%;height:80vh;"></iframe>`;
  } else {
    viewer.innerHTML = `<p style="text-align:center;">❌ Jenis file ini tidak dapat ditampilkan langsung di browser.</p>`;
  }

  // Tombol Download — ambil langsung dari localStorage
  downloadBtn.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = fileData;
    a.download = item.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

} else {
  document.body.innerHTML = `
    <h2 style="text-align:center; margin-top:40px;">❌ File tidak ditemukan di penyimpanan.</h2>
    <div style="text-align:center; margin-top:20px;">
      <a href="makalah.html" class="back-btn">Kembali</a>
    </div>
  `;
}
