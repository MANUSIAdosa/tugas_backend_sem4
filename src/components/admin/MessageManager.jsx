import { getAuthToken } from '../../utils/api';

export default function MessageManager({ messages, showToast, onRefresh }) {
  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus pesan ini?')) return;
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/admin/contact-messages/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) { showToast(json.message); onRefresh(); }
      else showToast(json.message, 'error');
    } catch { showToast('Gagal menghapus pesan', 'error'); }
  };

  return (
    <section>
      <div className="admin-section-header">
        <p className="admin-section-desc">{messages.length} pesan/keluhan masuk</p>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Pesan / Keluhan</th>
              <th>User ID</th>
              <th>Tanggal</th>
              <th style={{ width: 100 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr><td colSpan={6} className="admin-empty">Belum ada pesan masuk</td></tr>
            ) : messages.map(msg => (
              <tr key={msg.id}>
                <td><span className="admin-game-name">{msg.user?.username || 'Guest'}</span></td>
                <td>
                  {msg.user?.email ? (
                    <a href={`mailto:${msg.user.email}`} style={{ color: '#00f2ff', textDecoration: 'none' }}>{msg.user.email}</a>
                  ) : '-'}
                </td>
                <td style={{ whiteSpace: 'normal', wordBreak: 'break-all', minWidth: 200 }}>{msg.message}</td>
                <td><code className="admin-code">{msg.userId}</code></td>
                <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(msg.createdAt).toLocaleString('id-ID')}</td>
                <td>
                  <button className="admin-btn-sm admin-btn-delete" onClick={() => handleDelete(msg.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
