import { useState } from 'react';
import { getAuthToken } from '../../utils/api';
import Modal from './Modal';
import Input from './Input';

const emptyForm = { code: '', rewardValue: '', quota: '100', rewardType: 'points', isActive: 'true', validUntil: '' };

export default function VoucherManager({ vouchers, showToast, onRefresh }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/admin/vouchers/${editId}` : '/api/admin/vouchers';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, rewardValue: Number(form.rewardValue), quota: Number(form.quota) })
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        setModal(null);
        setForm(emptyForm);
        setEditId(null);
        onRefresh();
      } else showToast(json.message, 'error');
    } catch { showToast('Gagal menyimpan voucher', 'error'); }
  };

  const handleDelete = async (id, code) => {
    if (!confirm(`Hapus voucher "${code}"?`)) return;
    const token = getAuthToken();
    try {
      const res = await fetch(`/api/admin/vouchers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) { showToast(json.message); onRefresh(); }
      else showToast(json.message, 'error');
    } catch { showToast('Gagal menghapus voucher', 'error'); }
  };

  const openEdit = (v) => {
    setForm({
      code: v.code,
      rewardValue: String(v.rewardValue),
      quota: String(v.quota),
      rewardType: v.rewardType || 'points',
      isActive: String(v.isActive),
      validUntil: v.validUntil ? v.validUntil.slice(0, 10) : ''
    });
    setEditId(v.id);
    setModal('voucher');
  };

  return (
    <section>
      <div className="admin-section-header">
        <p className="admin-section-desc">{vouchers.length} kode voucher</p>
        <button className="admin-btn admin-btn-primary"
          onClick={() => { setForm(emptyForm); setEditId(null); setModal('voucher'); }}>
          + Tambah Voucher
        </button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Reward</th>
              <th>Kuota</th>
              <th>Terpakai</th>
              <th>Tipe</th>
              <th>Berakhir</th>
              <th>Status</th>
              <th style={{ width: 160 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.length === 0 ? (
              <tr><td colSpan={8} className="admin-empty">Belum ada voucher</td></tr>
            ) : vouchers.map(v => (
              <tr key={v.id}>
                <td><code className="admin-code" style={{ fontSize: '0.9rem' }}>{v.code}</code></td>
                <td><span className="admin-price">{v.rewardValue.toLocaleString('id-ID')}</span></td>
                <td>{v.quota}</td>
                <td>{v.usedCount}</td>
                <td>{v.rewardType || '-'}</td>
                <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  {v.validUntil ? new Date(v.validUntil).toLocaleDateString('id-ID') : '-'}
                </td>
                <td>
                  {v.isActive
                    ? <span className="admin-category-badge">Aktif</span>
                    : <span style={{ color: '#64748b' }}>Nonaktif</span>}
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-btn-sm admin-btn-edit" onClick={() => openEdit(v)}>Edit</button>
                    <button className="admin-btn-sm admin-btn-delete" onClick={() => handleDelete(v.id, v.code)}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal === 'voucher' && (
        <Modal title={editId ? 'Edit Voucher' : 'Tambah Voucher'} onClose={() => setModal(null)}>
          <form onSubmit={handleSave}>
            <Input label="Kode Voucher" value={form.code}
              onChange={v => setForm(p => ({ ...p, code: v }))} required placeholder="RAST72026" />
            <Input label="Nilai Reward (Poin)" type="number" value={form.rewardValue}
              onChange={v => setForm(p => ({ ...p, rewardValue: v }))} required placeholder="10000" />
            <Input label="Kuota" type="number" value={form.quota}
              onChange={v => setForm(p => ({ ...p, quota: v }))} placeholder="100" />
            <div className="admin-field">
              <label>Tipe Reward</label>
              <select value={form.rewardType}
                onChange={e => setForm(p => ({ ...p, rewardType: e.target.value }))}>
                <option value="points">Points</option>
              </select>
            </div>
            <Input label="Berlaku Sampai (Kosongkan jika tidak ada batas)" type="date" value={form.validUntil}
              onChange={v => setForm(p => ({ ...p, validUntil: v }))} />
            <div className="admin-field">
              <label>Status</label>
              <select value={form.isActive}
                onChange={e => setForm(p => ({ ...p, isActive: e.target.value }))}>
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModal(null)}>Batal</button>
              <button type="submit" className="admin-btn admin-btn-primary">{editId ? 'Update' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
