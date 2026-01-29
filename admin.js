const scriptURL = "https://script.google.com/macros/s/AKfycbwJBDYtCiTLn7RyoRYm3OLZm3GO0mKxK9SvKWbX-8dxtv8aAWOuBf9M684a8Ltg8Bj5dw/exec";

// 1. Navigasi Tab
function showTab(tabId, btn) {
    $(".tab-content").addClass("hidden");
    $(".nav-btn").removeClass("active");
    $("#" + tabId).removeClass("hidden");
    $(btn).addClass("active");
}

// 2. Load Data dari Google Sheets
function loadDataAdmin() {
    // Memanggil Apps Script dengan parameter action=read
    $.getJSON(scriptURL + "?action=read", function(data) {
        renderKelolaPesanan(data);
        renderKelolaBayar(data);
    });
}

// 3. Render Kelola Pesanan (Sesuai Class KelolaPemesanan)
function renderKelolaPesanan(data) {
    let html = "";
    data.forEach(item => {
        if(item.status_pesanan !== "Selesai") {
            html += `
            <div class="card card-item animate-fade">
                <span class="status-badge bg-pending">${item.status_pesanan || 'Antri'}</span>
                <strong>${item.nama}</strong>
                <p style="font-size:0.85rem; margin:5px 0;">${item.menu}</p>
                <button class="btn-action" style="background:var(--primary); color:white;" onclick="updateStatus('${item.id}', 'pesanan')">
                    Selesai Dimasak
                </button>
            </div>`;
        }
    });
    $("#container-pesanan").html(html || "<p style='text-align:center;'>Tidak ada antrian masak</p>");
}

// 4. Render Kelola Bayar (Sesuai Class KelolaBayar)
function renderKelolaBayar(data) {
    let html = "";
    data.forEach(item => {
        if(item.status_bayar !== "Lunas") {
            html += `
            <div class="card card-item animate-fade" style="border-left-color: #28a745;">
                <span class="status-badge bg-pending">Belum Bayar</span>
                <strong>${item.nama}</strong>
                <p style="color:var(--primary); font-weight:bold;">Total: Rp ${parseInt(item.total).toLocaleString()}</p>
                <small>Metode: ${item.metode || 'Tunai'}</small>
                <button class="btn-action" style="background:#28a745; color:white;" onclick="updateStatus('${item.id}', 'bayar')">
                    Konfirmasi Lunas
                </button>
            </div>`;
        }
    });
    $("#container-bayar").html(html || "<p style='text-align:center;'>Semua tagihan lunas</p>");
}

// 5. Update Status (Verifikasi/Update)
function updateStatus(id, tipe) {
    if(!confirm("Konfirmasi perubahan status ini?")) return;
    
    // Kirim data ke Apps Script untuk update baris di Google Sheets
    $.post(scriptURL, { action: "update", id: id, tipe: tipe }, function(res) {
        alert("Status diperbarui!");
        loadDataAdmin(); // Refresh data
    });
}

// 6. Logout
function handleLogout() {
    localStorage.clear();
    window.location.href = "login.html";
}

$(document).ready(loadDataAdmin);