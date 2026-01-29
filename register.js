const scriptURL =
  "https://script.google.com/macros/s/AKfycbwJBDYtCiTLn7RyoRYm3OLZm3GO0mKxK9SvKWbX-8dxtv8aAWOuBf9M684a8Ltg8Bj5dw/exec"; // Ganti dengan URL deployment anda

const daftarMenu = [
  {
    n: "Ayam Goreng",
    p: 23000,
    img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=150",
  },
  {
    n: "Bebek Goreng",
    p: 35000,
    img: "https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?w=150",
  },
  {
    n: "Lele Goreng",
    p: 20000,
    img: "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=150",
  },
  {
    n: "Kepala Ayam",
    p: 2600,
    img: "https://via.placeholder.com/150?text=Kepala",
  },
  {
    n: "Tahu / Tempe",
    p: 1000,
    img: "https://via.placeholder.com/150?text=Tahu",
  },
  {
    n: "Nasi Putih",
    p: 5000,
    img: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=150",
  },
];

function renderMenu() {
  const list = document.getElementById("menuList");
  daftarMenu.forEach((m, i) => {
    list.innerHTML += `
            <div class="menu-item">
                <div class="menu-info">
                    <img src="${m.img}" alt="${m.n}">
                    <div class="menu-text">
                        <h4>${m.n}</h4>
                        <p>Rp ${m.p.toLocaleString()}</p>
                    </div>
                </div>
                <input type="number" class="qty qty-input" data-idx="${i}" value="0" min="0" onchange="hitungTotal()">
            </div>`;
  });
}

function hitungTotal() {
  let sub = 0;
  let detail = [];

  $(".qty").each(function () {
    let q = parseInt($(this).val());
    let m = daftarMenu[$(this).data("idx")];
    if (q > 0) {
      sub += q * m.p;
      detail.push(`${m.n} (${q})`);
    }
  });

  const layanan = $("#layananSelect").val();
  if (layanan === "Antar ke rumah") {
    sub += 5000;
    $("#alamatBox").removeClass("hidden");
  } else {
    $("#alamatBox").addClass("hidden");
  }

  $("#displayTotal").text("Rp " + sub.toLocaleString());
  $("#inputTotal").val(sub);
  $("#inputDetail").val(detail.join(", "));
}

function toggleDana() {
  const p = $("#pembayaranSelect").val();
  if (p === "DANA") {
    $("#infoDana").removeClass("hidden");
  } else {
    $("#infoDana").addClass("hidden");
  }
}

$("#orderForm").submit(function (e) {
  e.preventDefault();
  if ($("#inputTotal").val() == 0) return alert("Pilih menu dulu bos!");

  const btn = $(".btn-submit");
  btn.prop("disabled", true).html("<span>Mengirim...</span>");

  $.ajax({
    url: scriptURL,
    type: "POST",
    data: $(this).serialize(),
    success: function () {
      alert("Pesanan Mantap! Berhasil dikirim.");
      location.reload();
    },
    error: function () {
      alert("Waduh, gagal kirim.");
      btn.prop("disabled", false).html("<span>Konfirmasi Pesanan</span>");
    },
  });
});

$(document).ready(renderMenu);
// Fungsi untuk mengambil data dari Google Sheets (GET)
function loadOrderHistory() {
  // Gunakan parameter action=read jika Apps Script Anda mendukungnya
  $.getJSON(scriptURL + "?action=read", function (data) {
    let html = "";
    if (data && data.length > 0) {
      // Kita balik urutannya agar pesanan terbaru di atas
      data.reverse().forEach((row) => {
        html += `
                    <tr>
                        <td style="font-weight:600;">${row.nama}</td>
                        <td style="font-size:0.75rem; opacity:0.8;">${row.menu}</td>
                        <td style="color:var(--primary); font-weight:600;">Rp${parseInt(row.total).toLocaleString()}</td>
                    </tr>
                `;
      });
    } else {
      html =
        "<tr><td colspan='3' style='text-align:center;'>Belum ada pesanan</td></tr>";
    }
    $("#orderHistoryBody").html(html);
  });
}

// Fungsi Pencarian (Filter Nama)
function filterOrders() {
  let input = document.getElementById("searchInput").value.toUpperCase();
  let table = document.getElementById("orderTable");
  let tr = table.getElementsByTagName("tr");

  for (let i = 1; i < tr.length; i++) {
    let td = tr[i].getElementsByTagName("td")[0]; // Kolom Nama
    if (td) {
      let txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(input) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// Jalankan fungsi load saat halaman dibuka
$(document).ready(function () {
  renderMenu();
  loadOrderHistory();
});
