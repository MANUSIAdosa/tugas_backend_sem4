import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <main className="about-main">
      <div className="about-container">

        <img src="/asset/logo.png" alt="Rast7" className="about-logo" />

        <h1 className="about-title">Tentang Rast7</h1>

        <p className="about-body">
          Selamat datang di <strong>Rast7</strong> — platform top-up game tepercaya Anda,
          didirikan oleh sesama gamer yang mengerti pentingnya kecepatan dan kemudahan dalam bermain.
          Kami tahu bahwa setiap detik dalam permainan sangat berharga.
          Itulah mengapa misi kami adalah menyediakan layanan top-up yang instan, aman, dan tanpa ribet.
        </p>

        <p className="about-body">
          Di Rast7, kami berkomitmen untuk memberikan pengalaman terbaik bagi para gamer di Indonesia.
          Kami percaya bahwa top-up seharusnya tidak rumit.
        </p>

        {/* ─── Stats Strip: signature element ─── */}
        <div className="about-stats">
          <div className="about-stat-item">
            <i className="bi bi-lightning-charge-fill about-stat-icon" />
            <span className="about-stat-label">Cepat</span>
            <span className="about-stat-desc">Proses instan 24/7</span>
          </div>
          <div className="about-stat-divider" />
          <div className="about-stat-item">
            <i className="bi bi-shield-check-fill about-stat-icon" />
            <span className="about-stat-label">Aman</span>
            <span className="about-stat-desc">Pembayaran terenkripsi</span>
          </div>
          <div className="about-stat-divider" />
          <div className="about-stat-item">
            <i className="bi bi-coin about-stat-icon" />
            <span className="about-stat-label">Harga Terbaik</span>
            <span className="about-stat-desc">Paling bersaing</span>
          </div>
          <div className="about-stat-divider" />
          <div className="about-stat-item">
            <i className="bi bi-headset about-stat-icon" />
            <span className="about-stat-label">Support</span>
            <span className="about-stat-desc">Tim andal siap membantu</span>
          </div>
        </div>

        {/* ─── Reasons List ─── */}
        <div className="about-reasons">
          <h2 className="about-reasons-title">Mengapa Memilih Rast7?</h2>

          <div className="about-reason-item">
            <div className="about-reason-icon-wrap">
              <i className="bi bi-rocket-takeoff-fill" />
            </div>
            <div className="about-reason-text">
              <strong>Proses Cepat & Instan</strong>
              <p>Pesanan Anda diproses secara otomatis 24/7. Setelah pembayaran berhasil, top-up akan langsung masuk ke akun game Anda dalam hitungan detik.</p>
            </div>
          </div>

          <div className="about-reason-item">
            <div className="about-reason-icon-wrap">
              <i className="bi bi-lock-fill" />
            </div>
            <div className="about-reason-text">
              <strong>Pembayaran Aman & Lengkap</strong>
              <p>Kami menyediakan berbagai metode pembayaran populer (e-wallet, virtual account bank, dan lainnya) yang didukung oleh sistem keamanan terenkripsi untuk menjamin keamanan transaksi Anda.</p>
            </div>
          </div>

          <div className="about-reason-item">
            <div className="about-reason-icon-wrap">
              <i className="bi bi-graph-up-arrow" />
            </div>
            <div className="about-reason-text">
              <strong>Harga Kompetitif</strong>
              <p>Kami selalu berusaha memberikan harga terbaik dan paling bersaing untuk semua game favorit Anda.</p>
            </div>
          </div>

          <div className="about-reason-item">
            <div className="about-reason-icon-wrap">
              <i className="bi bi-chat-dots-fill" />
            </div>
            <div className="about-reason-text">
              <strong>Layanan Pelanggan Andal</strong>
              <p>Tim support kami siap membantu Anda jika Anda mengalami kendala atau memiliki pertanyaan.</p>
            </div>
          </div>
        </div>

        <p className="about-closing">
          Terima kasih telah menjadikan Rast7 sebagai partner top-up Anda. Selamat bermain!
        </p>

      </div>
    </main>
  );
};

export default About;
