import { useState } from 'react';
import { getAuthToken } from '../../utils/api';
import Modal from './Modal';
import Input from './Input';

const emptyForm = { name: '', slug: '' };

export default function CategoryManager({ categories, showToast, onRefresh }) {
  const [modal, setModal] = useState(null);
  const [catForm, setCatForm] = useState(emptyForm);
  const [catEdit, setCatEdit] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    const method = catEdit ? 'PUT' : 'POST';
    const url = catEdit ? `/api/admin/categories/${catEdit}` : '/api/admin/categories';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(catForm)
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        setModal(null);
        setCatForm(emptyForm);
        setCatEdit(null);
        onRefresh();
      } else showToast(json.message, 'error');
    } catch { showToast('Gagal menyimpan kategori', 'error'); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Hapus kategori "${name}"?`)) return;
    const token = getAuthToken();
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      onRefresh();
    } catch { /* ignore */ }
  };

  return (
    <section>
      <div className="admin-section-header">
        <p className="admin-section-desc">{categories.length} kategori</p>
        <button className="admin-btn admin-btn-primary"
          onClick={() => { setCatForm(emptyForm); setCatEdit(null); setModal('category'); }}>
          + Tambah Kategori
        </button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Nama</th><th>Slug</th><th style={{ width: 160 }}>Aksi</th></tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={3} className="admin-empty">Belum ada kategori</td></tr>
            ) : categories.map(cat => (
              <tr key={cat.id}>
                <td><span className="admin-game-name">{cat.name}</span></td>
                <td><code className="admin-code">{cat.slug}</code></td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-btn-sm admin-btn-edit"
                      onClick={() => { setCatForm({ name: cat.name, slug: cat.slug }); setCatEdit(cat.id); setModal('category'); }}>Edit</button>
                    <button className="admin-btn-sm admin-btn-delete"
                      onClick={() => handleDelete(cat.id, cat.name)}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal === 'category' && (
        <Modal title={catEdit ? 'Edit Kategori' : 'Tambah Kategori'} onClose={() => setModal(null)}>
          <form onSubmit={handleSave}>
            <Input label="Nama Kategori" value={catForm.name}
              onChange={v => setCatForm(p => ({ ...p, name: v }))} required placeholder="Mobile" />
            <Input label="Slug" value={catForm.slug}
              onChange={v => setCatForm(p => ({ ...p, slug: v }))} required placeholder="mobile" />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModal(null)}>Batal</button>
              <button type="submit" className="admin-btn admin-btn-primary">{catEdit ? 'Update' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
