import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Faq.css';

const Faq = () => {
  return (
    <>
      <main className="faq-main">
        <div className="faq-bgn-ats">
          <h1>Bagaimana Kami Bisa Membantu ?</h1>
          <p>
            Temukan jawaban untuk pertanyaan yang sering diajukan atau hubungi tim
            dukungan kami
          </p>
        </div>

        <section className="faq-section">
          <div className="faq-q-a-wrapper">
            <a
              data-bs-toggle="collapse"
              href="#q-1"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              <div className="faq-quest">
                <p className="d-inline-flex gap-1">
                  <span>1</span>
                  Bagaimana cara membuat akun baru ?
                </p>
              </div>
            </a>
            <div className="collapse" id="q-1">
              <div className="faq-answer">
                <div className="card card-body">
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
          </div>
          <div className="faq-q-a-wrapper">
            <a
              data-bs-toggle="collapse"
              href="#q-2"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              <div className="faq-quest">
                <p className="d-inline-flex gap-1">
                  <span>2</span>
                  Metode pembayaran apa saja yang tersedia ?
                </p>
              </div>
            </a>
            <div className="collapse" id="q-2">
              <div className="faq-answer">
                <div className="card card-body">
                  Kami menerima berbagai metode pembayaran untuk kenyamanan Anda: <br />
                  <br />
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
          </div>
          <div className="faq-q-a-wrapper">
            <a
              data-bs-toggle="collapse"
              href="#q-3"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              <div className="faq-quest">
                <p className="d-inline-flex gap-1">
                  <span>3</span>
                  Mengapa saya tidak bisa login ke akun saya ?
                </p>
              </div>
            </a>
            <div className="collapse" id="q-3">
              <div className="faq-answer">
                <div className="card card-body">
                  Jika Anda mengalami kesulitan login, coba solusi berikut: <br />
                  <br />
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
          </div>
          <div className="faq-q-a-wrapper">
            <a
              data-bs-toggle="collapse"
              href="#q-4"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              <div className="faq-quest">
                <p className="d-inline-flex gap-1">
                  <span>4</span>
                  Apakah ada biaya tambahan atau tersembunyi ?
                </p>
              </div>
            </a>
            <div className="collapse" id="q-4">
              <div className="faq-answer">
                <div className="card card-body">
                  Kami berkomitmen untuk transparansi penuh dalam biaya: <br />
                  <br />
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
          </div>
          <div className="faq-q-a-wrapper">
            <a
              data-bs-toggle="collapse"
              href="#q-5"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              <div className="faq-quest">
                <p className="d-inline-flex gap-1">
                  <span>5</span>
                  Apakah aplikasi tersedia untuk mobile ?
                </p>
              </div>
            </a>
            <div className="collapse" id="q-5">
              <div className="faq-answer">
                <div className="card card-body">
                  Ya, aplikasi mobile kami tersedia untuk: <br />
                  <br />
                  • Android (versi 5.0 ke atas) <br />
                  • iOS (versi 11.0 ke atas) <br />
                  <br />
                  Fitur aplikasi mobile: <br />
                  • Notifikasi real-time <br />
                  • Offline mode untuk fitur tertentu <br />
                  • Interface yang dioptimalkan untuk mobile <br />
                  • Biometric login (fingerprint/face ID) <br />
                  • Dark mode support <br />
                  <br />
                  Download di Google Play Store atau App Store.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Faq;