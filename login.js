function prosesLogin() {
    const card = document.querySelector('.form-card');
    const btn = document.getElementById('login-btn');
    const userImg = document.getElementById('username');
    const passImg = document.getElementById('password');
    const errorMsg = document.getElementById('error-msg');

    // Reset error
    errorMsg.style.display = "none";

    // Data Statis yang diminta
    const correctUser = "admin"; // Anda bisa ganti ini
    const correctPass = "Udin 123";

    // 1. Validasi Input Kosong
    if (!userImg.value.trim() || !passImg.value.trim()) {
        triggerError(card);
        return;
    }

    // Tampilan Memproses
    btn.disabled = true;
    btn.innerHTML = "⏳ Memvalidasi...";

    // 2. Logika Cek Password (Simulasi Delay)
    setTimeout(() => {
        if (passImg.value === correctPass) {
            // Jika Berhasil
            btn.style.background = "#2ecc71";
            btn.innerHTML = "Selamat Datang! ✓";
        
              card.style.transform = "scale(0.9)";
            card.style.opacity = "0";
            /*Jika login berhasil, user diarahkan ke halaman selanjutnya*/
            setTimeout(() => {
                window.location.href = "register.html";
            }, 600);

            setTimeout(() => {
                // Arahkan ke halaman menu makanan
                window.location.href = "menu.html"; 
            }, 600);
        } else {
            // Jika Gagal
            btn.disabled = false;
            btn.innerHTML = "Masuk Sekarang <span class='arrow'>↗</span>";
            errorMsg.style.display = "block";
            triggerError(card);
        }
    }, 1000);
}

function triggerError(el) {
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 500);
}