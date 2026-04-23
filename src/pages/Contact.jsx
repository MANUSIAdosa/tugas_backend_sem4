import React from 'react';
import '../styles/Contact.css';
import '../styles/Animations.css';

const Contact = () => {
  return (
    <main className="contact-main">
      <div className="contact-container">
        <form action="#">
          <div className="contact-form-grup">
            <label htmlFor="nama">Masukkan Nama</label><br />
            <input type="text" name="nama" id="nama" placeholder="Nama Anda" />
          </div>
          <div className="contact-form-grup">
            <label htmlFor="email">Masukkan Email</label><br />
            <input type="email" name="email" id="email" placeholder="Email Anda" />
          </div>
          <div className="contact-form-grup">
            <label htmlFor="pesan">Pesan Keluhan</label><br />
            <input type="text" name="pesan" id="pesan" placeholder="Pesan atau Keluhan Anda" className="contact-keluhan" />
          </div>
          <button type="submit" className="btn btn-secondary" value="submit" style={{ margin: 'auto 40%' }}>Kirim</button>
        </form>
      </div>
      <div className="contact-container-contact">
        <div>untuk bagian administrasi bisa menghubungi</div>
        <div>Via Whatsapp</div>
        <div><img src="/asset/logo_sosmed/whatsapp.png" alt="" />+6289509450345</div>
        <div>Via Telegram</div>
        <div><img src="/asset/logo_sosmed/telegram.png" alt="" />+6289509450345</div>
        <div>Via Email</div>
        <div><img src="/asset/logo_sosmed/gmail.png" alt="" />rast777@gmail.com</div>
      </div>
    </main>
  );
};

export default Contact;