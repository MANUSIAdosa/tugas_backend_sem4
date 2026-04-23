import React from 'react';
import '../styles/Promo.css';

const Promo = () => {
  return (
    <>
      <main className="promo-main">
      <section className="promo-section">
        <div className="promo-bagian-1">
          <h1>
            Promo Games: Cashback hingga 90% Buat Top Up Game di RAST
          </h1>
          <div className="promo-img-container">
            <img src="/asset/gambar_promo/promo_gacor.jpg" alt="" />
          </div>

          <p className="promo-prd-promo">Periode Promo 1-30 Okt 2025 </p>
          <p className="promo-info-promo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"/>
            </svg>
            Seluruh Indonesia
          </p>
          <p className="promo-info-promo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
              <path d="M24-16C10.7-16 0-5.3 0 8S10.7 32 24 32l45.3 0c3.9 0 7.2 2.8 7.9 6.6l52.1 286.3c6.2 34.2 36 59.1 70.8 59.1L456 384c13.3 0 24-10.7 24-24s-10.7-24-24-24l-255.9 0c-11.6 0-21.5-8.3-23.6-19.7l-5.1-28.3 303.6 0c30.8 0 57.2-21.9 62.9-52.2L568.9 69.9C572.6 50.2 557.5 32 537.4 32l-412.7 0-.4-2c-4.8-26.6-28-46-55.1-46L24-16zM208 512a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm224 0a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/>
            </svg>
            Games
          </p>
        </div>
        <div className="promo-bagian-2">
          <h2>Promo Mobile Legends di RAST Games GRATIS* Weekly Diamond Pass, Weekly Diamond Pass 2x (100% uang kembali), 59 Diamonds (100% uang kembali) S&K Berlaku</h2>
          <div className="promo-table-container">
            <table>
              <thead>
                <tr>
                  <th>Kategori Promo</th>
                  <th>Game</th>
                  <th>Periode</th>
                  <th>Promo</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Weekly Diamond Pass</td>
                  <td>Mobile Legends</td>
                  <td>1 Oktober–31 Desember 2025 (15.00-18.00)</td>
                  <td>Cashback 100% (maks. Rp27.195)</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>59 Diamonds</td>
                  <td>Mobile Legends</td>
                  <td>1 Oktober–31 Desember 2025 (00.00-23.59)</td>
                  <td>Cashback 100% (maks. Rp15.246)</td>
                  <td>Promo hanya berlaku untuk pengguna RAST Plus</td>
                </tr>
                <tr>
                  <td>Weekly Diamond Pass</td>
                  <td>Mobile Legends</td>
                  <td>1 Oktober–31 Desember 2025 (15.00-18.00)</td>
                  <td>Cashback 100% (maks. Rp27.195)</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>

          <ol className="promo-promo-terms">
            <li>Promo hanya berlaku untuk pengguna yang pertama kali bertransaksi di website RAST Games.</li>
            <li>Promo hanya berlaku di aplikasi RAST.</li>
            <li>Kuota promo terbatas.</li>
            <li>Promo dapat dipakai untuk 1x transaksi/pengguna/periode.</li>
            <li>Promo berlaku untuk transaksi di website RAST Games dengan metode pembayaran RAST & RAST Tabungan by Jago.</li>
            <li>Promo tidak berlaku untuk transaksi menggunakan RAST Coins secara penuh atau sebagian.</li>
            <li>Promo ini tidak dapat digabungkan dengan promo lainnya.</li>
            <li>Cashback akan diterima setelah pengguna klik tombol Pakai Promo ketika berada di halaman checkout.</li>
            <li>Cashback hanya akan diberikan jika pengguna membayar menggunakan saldo RAST.</li>
            <li>RAST berhak mengubah syarat dan ketentuan dan/atau menghentikan promosi tanpa pemberitahuan sebelumnya.</li>
            <li>RAST berhak menahan dan/atau membatalkan promo dan/atau membatasi layanan, baik untuk sementara maupun secara permanen, kepada pengguna sewaktu-waktu termasuk jika ditemukan tindakan penyalahgunaan (abuse), kecurangan (fraud) dan/atau aktivitas mencurigakan lainnya pada akun pengguna.</li>
            <li>RAST memiliki hak untuk menentukan berapa kali kamu bisa mendapat cashback dalam 1 hari.</li>
            <li>Dengan menggunakan promo ini, pengguna dianggap telah mengerti dan menyetujui seluruh syarat dan ketentuan yang berlaku.</li>
          </ol>
        </div>
      </section>
    </main>
    </>
  );
};

export default Promo;