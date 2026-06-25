import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/PelajariLebih.css';

const PelajariLebih = () => {
  return (
    <main className="pelajari-main">
      <div className="pelajari-container">

        <img src="/asset/logo.png" alt="Rast7" className="pelajari-logo" />

        <h1 className="pelajari-title">Pelajari Cara Top Up di Rast7</h1>

        <p className="pelajari-subtitle">
          Top-up di Rast7 sangat mudah! Kami telah merancang proses yang sederhana
          agar Anda bisa kembali ke permainan secepat mungkin. Ikuti 3 langkah mudah di bawah ini:
        </p>

        {/* ─── Step 1 ─── */}
        <div className="pelajari-step">
          <div className="pelajari-step-number">01</div>
          <div className="pelajari-step-content">
            <h2 className="pelajari-step-title">Pilih Game & Masukkan ID Anda</h2>
            <ul className="pelajari-step-list">
              <li>Pilih game favorit Anda dari daftar yang kami sediakan.</li>
              <li>
                Masukkan User ID dan Server/Zone ID Anda (jika diperlukan).
                Pastikan Anda memasukkannya dengan benar untuk menghindari kesalahan.
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Step 2 ─── */}
        <div className="pelajari-step">
          <div className="pelajari-step-number">02</div>
          <div className="pelajari-step-content">
            <h2 className="pelajari-step-title">Pilih Nominal & Metode Pembayaran</h2>
            <ul className="pelajari-step-list">
              <li>Pilih jumlah diamond, UC, atau mata uang game yang Anda inginkan.</li>
              <li>
                Pilih metode pembayaran yang paling nyaman untuk Anda.
                Kami menyediakan berbagai opsi mulai dari e-wallet (DANA, OVO, GoPay) hingga transfer bank.
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Step 3 ─── */}
        <div className="pelajari-step">
          <div className="pelajari-step-number">03</div>
          <div className="pelajari-step-content">
            <h2 className="pelajari-step-title">Selesaikan Pembayaran & Top-Up Masuk!</h2>
            <ul className="pelajari-step-list">
              <li>Lakukan pembayaran sesuai instruksi yang muncul di layar.</li>
              <li>
                Setelah pembayaran terkonfirmasi, sistem kami akan segera memproses pesanan Anda.
                Top-up akan masuk secara otomatis ke akun game Anda dalam hitungan detik!
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Help CTA ─── */}
        <div className="pelajari-help">
          <strong className="pelajari-help-label">Masih Bingung?</strong>
          <p>
            Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk mengunjungi halaman{' '}
            <Link to="/faq">FAQ</Link> kami atau langsung hubungi{' '}
            <Link to="/contact">Layanan Pelanggan</Link> kami. Kami siap membantu!
          </p>
        </div>

      </div>
    </main>
  );
};

export default PelajariLebih;
