import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PointContext } from "../components/PointContext";
import '../styles/Point.css';

const Point = () => {
  const { points } = useContext(PointContext);

  return (
    <>
      <main className="points-section">
        <div className="container">
          <div className="row">

            <div className="col-lg-5 mb-4 mb-lg-0">
              <div className="points-card">
                <h4><i className="bi bi-gem"></i> Poin RAST-7 Saya</h4>
                <div className="points-display">
                  {/* Tampilkan poin dengan format ribuan otomatis */}
                  {points.toLocaleString('id-ID')}
                </div>
                <p>
                  Gunakan poin Anda untuk mendapatkan diskon pada saat topup.
                </p>
                <div className="mt-4">
                  <Link to="/voucher" className="voucher-link"> Klik di sini untuk redeem lebih banyak poin <i className="bi bi-arrow-right-short"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="leaderboard-card">
                <h4><i className="bi bi-bar-chart-line-fill"></i> Top Spender (30 Hari Terakhir)</h4>
                
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="rank-badge rank-1">1</span>
                      <i className="bi bi-trophy-fill text-warning me-2"></i>
                      <strong>Zinx.</strong>
                    </div>
                    <span className="text-muted fw-500">Rp 20.760.369</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="rank-badge rank-2">2</span>
                      <i className="bi bi-trophy-fill text-secondary me-2"></i>
                      <strong>Mode0nAktifz</strong>
                    </div>
                    <span className="text-muted fw-500">Rp 19.413.691</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="rank-badge rank-3">3</span>
                      <i className="bi bi-trophy-fill text-bronze me-2"></i>
                      <strong>Trvan Edg</strong>
                    </div>
                    <span className="text-muted fw-500">Rp 18.234.321</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="rank-badge">4</span>
                      <span>RGSchatzRichs</span>
                    </div>
                    <span className="text-muted fw-500">Rp 17.890.652</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="rank-badge">5</span>
                      <span>RobloxMaster</span>
                    </div>
                    <span className="text-muted fw-500">Rp 14.671.892</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="rank-badge">6</span>
                      <span>Clasher007</span>
                    </div>
                    <span className="text-muted fw-500">Rp 13.540.321</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="rank-badge">7</span>
                      <span>AloyFan</span>
                    </div>
                    <span className="text-muted fw-500">Rp 12.430.578</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="rank-badge">8</span>
                      <span>TopUpTerus</span>
                    </div>
                    <span className="text-muted fw-500">Rp 11.245.960</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="rank-badge">9</span>
                      <span>JokiHandal</span>
                    </div>
                    <span className="text-muted fw-500">Rp 10.879.352</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="rank-badge">10</span>
                      <span>Rast7Fan</span>
                    </div>
                    <span className="text-muted fw-500">Rp 9.765.213</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
};

export default Point;