import React from 'react';
import '../styles/Faq.css';

const Faq = () => {
  return (
    <main className="faq-main">
      <div className="faq-hero">
        <h1 className="faq-hero-title">Bagaimana Kami Bisa Membantu?</h1>
        <p className="faq-hero-sub">
          Temukan jawaban untuk pertanyaan yang sering diajukan atau hubungi tim dukungan kami
        </p>
      </div>

      <section className="faq-section">
        <div className="faq-list">

          {/* Q1 */}
          <div className="faq-item">
            <a data-bs-toggle="collapse" href="#faq-1" role="button" aria-expanded="false" aria-controls="faq-1">
              <div className="faq-question">
                <span className="faq-number">1</span>
                Bagaimana cara membuat akun baru?
              </div>
            </a>
            <div className="collapse" id="faq-1">
              <div className="faq-answer">
                Untuk membuat akun baru, ikuti langkah-langkah berikut:
                <ol>
                  <li>Klik tombol "Daftar" di halaman utama</li>
                  <li>Isi formulir pendaftaran dengan data yang valid</li>
                  <li>Verifikasi email Anda melalui link yang dikirimkan</li>
                  <li>Selesaikan profil Anda dengan informasi tambahan</li>
                  <li>Akun Anda siap digunakan!</li>
                </ol>
                Proses pendaftaran biasanya memakan waktu kurang dari 5 menit.
              </div>
            </div>
          </div>

          {/* Q2 */}
          <div className="faq-item">
            <a data-bs-toggle="collapse" href="#faq-2" role="button" aria-expanded="false" aria-controls="faq-2">
              <div className="faq-question">
                <span className="faq-number">2</span>
                Metode pembayaran apa saja yang tersedia?
              </div>
            </a>
            <div className="collapse" id="faq-2">
              <div className="faq-answer">
                Kami menerima berbagai metode pembayaran untuk kenyamanan Anda:
                <br /><br />
                • Transfer Bank (BCA, Mandiri, BNI, BRI)<br />
                • E-Wallet (GoPay, OVO, DANA, LinkAja)<br />
                • Kartu Kredit (Visa, MasterCard, JCB)<br />
                • Virtual Account<br />
                • QRIS<br />
                • Cicilan 0% (kartu kredit tertentu)<br />
                <br />
                Semua transaksi dilindungi dengan enkripsi untuk keamanan maksimal.
              </div>
            </div>
          </div>

          {/* Q3 */}
          <div className="faq-item">
            <a data-bs-toggle="collapse" href="#faq-3" role="button" aria-expanded="false" aria-controls="faq-3">
              <div className="faq-question">
                <span className="faq-number">3</span>
                Mengapa saya tidak bisa login ke akun saya?
              </div>
            </a>
            <div className="collapse" id="faq-3">
              <div className="faq-answer">
                Jika Anda mengalami kesulitan login, coba solusi berikut:
                <br /><br />
                1. Periksa kembali email dan password yang dimasukkan<br />
                2. Pastikan caps lock tidak aktif<br />
                3. Clear cache browser Anda<br />
                4. Coba gunakan browser lain<br />
                5. Reset password jika lupa<br />
                6. Hubungi support jika masalah berlanjut<br />
                <br />
                Pastikan Anda menggunakan koneksi internet yang stabil.
              </div>
            </div>
          </div>

          {/* Q4 */}
          <div className="faq-item">
            <a data-bs-toggle="collapse" href="#faq-4" role="button" aria-expanded="false" aria-controls="faq-4">
              <div className="faq-question">
                <span className="faq-number">4</span>
                Apakah ada biaya tambahan atau tersembunyi?
              </div>
            </a>
            <div className="collapse" id="faq-4">
              <div className="faq-answer">
                Kami berkomitmen untuk transparansi penuh dalam biaya:
                <br /><br />
                • Tidak ada biaya pendaftaran<br />
                • Tidak ada biaya tersembunyi<br />
                • Semua biaya akan ditampilkan sebelum checkout<br />
                • Biaya admin (jika ada) akan diinformasikan di awal<br />
                • Pajak sesuai ketentuan pemerintah<br />
                <br />
                Anda akan melihat rincian biaya lengkap sebelum melakukan pembayaran.
              </div>
            </div>
          </div>

          {/* Q5 */}
          <div className="faq-item">
            <a data-bs-toggle="collapse" href="#faq-5" role="button" aria-expanded="false" aria-controls="faq-5">
              <div className="faq-question">
                <span className="faq-number">5</span>
                Apakah aplikasi tersedia untuk mobile?
              </div>
            </a>
            <div className="collapse" id="faq-5">
              <div className="faq-answer">
                Ya, aplikasi mobile kami tersedia untuk:
                <br /><br />
                • Android (versi 5.0 ke atas)<br />
                • iOS (versi 11.0 ke atas)<br />
                <br />
                Fitur aplikasi mobile:
                <br />
                • Notifikasi real-time<br />
                • Offline mode untuk fitur tertentu<br />
                • Interface yang dioptimalkan untuk mobile<br />
                • Biometric login (fingerprint/face ID)<br />
                • Dark mode support<br />
                <br />
                Download di Google Play Store atau App Store.
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

export default Faq;
