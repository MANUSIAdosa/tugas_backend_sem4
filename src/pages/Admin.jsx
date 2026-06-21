import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/Admin.css';

const MODAL_STYLES = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999, padding: '20px'
  },
  content: {
    background: '#1a1a2e', borderRadius: '12px', width: '100%',
    maxWidth: '560px', maxHeight: '90vh', overflow: 'auto',
    padding: '32px', border: '1px solid #2a2a45', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
  }
};

function Modal({ title, children, onClose }) {
  return (
    <div style={MODAL_STYLES.overlay} onClick={onClose}>
      <div style={MODAL_STYLES.content} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>{title}</h2>
          <button onClick={onClose} className="admin-modal-close">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, type = 'text', value, onChange, required, placeholder, step }) {
  return (
    <div className="admin-field">
      <label>{label}{required && <span className="admin-required">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        placeholder={placeholder} step={step} />
    </div>
  );
}

function Select({ label, value, onChange, options, required }) {
  return (
    <div className="admin-field">
      <label>{label}{required && <span className="admin-required">*</span>}</label>
      <select value={value} onChange={e => onChange(e.target.value)} required={required}>
        <option value="">-- Pilih --</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('games');
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal & form state
  const [modal, setModal] = useState(null); // 'addGame' | 'editGame' | 'addItem' | 'editItem' | null
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameItems, setGameItems] = useState([]);
  const [itemGameId, setItemGameId] = useState('');

  // Form data
  const emptyGameForm = { name: '', slug: '', logoUrl: '', bgUrl: '', hasZone: true, itemIconUrl: '', bgPosition: '' };
  const [gameForm, setGameForm] = useState(emptyGameForm);
  const emptyItemForm = { qty: '', itemName: '', originalPrice: '', discountPercent: '0' };
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [editTarget, setEditTarget] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    const token = sessionStorage.getItem('authToken');
    if (!stored || !token) { navigate('/login'); return; }
    try {
      const u = JSON.parse(stored);
      if (!u.isAdmin) { navigate('/'); return; }
      setUserData(u);
    } catch { navigate('/login'); }
  }, [navigate]);

  const loadGames = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/games');
      const json = await res.json();
      if (json.success) setGames(json.data);
    } catch (err) {
      showToast('Gagal memuat games', 'error');
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/users');
      const json = await res.json();
      if (json.success) setUsers(json.data);
    } catch (err) {
      showToast('Gagal memuat users', 'error');
    }
  }, []);

  const loadItems = useCallback(async (gameId) => {
    if (!gameId) { setGameItems([]); return; }
    try {
      const res = await api.get(`/api/admin/games/${gameId}/items`);
      const json = await res.json();
      if (json.success) setGameItems(json.data.items);
    } catch {
      showToast('Gagal memuat items', 'error');
    }
  }, []);

  useEffect(() => {
    if (!userData) return;
    setLoading(true);
    Promise.all([loadGames(), loadUsers()]).finally(() => setLoading(false));
  }, [userData, loadGames, loadUsers]);

  useEffect(() => {
    if (activeTab === 'items' && selectedGame) loadItems(selectedGame);
  }, [activeTab, selectedGame, loadItems]);

  // ---- Game CRUD ----
  const handleCreateGame = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/admin/games', gameForm);
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        setModal(null);
        setGameForm(emptyGameForm);
        loadGames();
      } else showToast(json.message, 'error');
    } catch { showToast('Gagal membuat game', 'error'); }
  };

  const handleUpdateGame = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/api/admin/games/${editTarget}`, gameForm);
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        setModal(null);
        setGameForm(emptyGameForm);
        setEditTarget(null);
        loadGames();
      } else showToast(json.message, 'error');
    } catch { showToast('Gagal mengupdate game', 'error'); }
  };

  const handleDeleteGame = async (id) => {
    if (!confirm('Yakin ingin menghapus game ini? Semua item di dalamnya juga akan terhapus.')) return;
    try {
      const res = await api.delete(`/api/admin/games/${id}`);
      const json = await res.json();
      if (json.success) { showToast(json.message); loadGames(); }
      else showToast(json.message, 'error');
    } catch { showToast('Gagal menghapus game', 'error'); }
  };

  const openEditGame = async (id) => {
    try {
      const res = await api.get(`/api/admin/games/${id}`);
      const json = await res.json();
      if (json.success) {
        const g = json.data;
        setGameForm({
          name: g.name || '', slug: g.slug || '', logoUrl: g.logoUrl || '',
          bgUrl: g.bgUrl || '', hasZone: g.hasZone !== false,
          itemIconUrl: g.itemIconUrl || '', bgPosition: g.bgPosition || ''
        });
        setEditTarget(id);
        setModal('editGame');
      }
    } catch { showToast('Gagal memuat data game', 'error'); }
  };

  // ---- Item CRUD ----
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...itemForm, qty: Number(itemForm.qty), originalPrice: Number(itemForm.originalPrice), discountPercent: Number(itemForm.discountPercent) };
      const res = await api.post(`/api/admin/games/${selectedGame}/items`, payload);
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        setModal(null);
        setItemForm(emptyItemForm);
        loadItems(selectedGame);
      } else showToast(json.message, 'error');
    } catch { showToast('Gagal menambah item', 'error'); }
  };

  const openEditItem = (item) => {
    setItemForm({ qty: String(item.qty), itemName: item.itemName, originalPrice: String(item.originalPrice), discountPercent: String(item.discountPercent) });
    setEditTarget(item.itemName);
    setModal('editItem');
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...itemForm, qty: Number(itemForm.qty), originalPrice: Number(itemForm.originalPrice), discountPercent: Number(itemForm.discountPercent) };
      const res = await api.put(`/api/admin/games/${selectedGame}/items/${encodeURIComponent(editTarget)}`, payload);
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        setModal(null);
        setItemForm(emptyItemForm);
        setEditTarget(null);
        loadItems(selectedGame);
      } else showToast(json.message, 'error');
    } catch { showToast('Gagal mengupdate item', 'error'); }
  };

  const handleDeleteItem = async (itemName) => {
    if (!confirm(`Yakin ingin menghapus item "${itemName}"?`)) return;
    try {
      const res = await api.delete(`/api/admin/games/${selectedGame}/items/${encodeURIComponent(itemName)}`);
      const json = await res.json();
      if (json.success) { showToast(json.message); loadItems(selectedGame); }
      else showToast(json.message, 'error');
    } catch { showToast('Gagal menghapus item', 'error'); }
  };

  // ---- UI helpers ----
  const formatPrice = (p) => new Intl.NumberFormat('id-ID').format(p || 0);
  const activeGame = games.find(g => g.id === selectedGame);

  if (!userData) return null;

  const TABS = [
    { key: 'games', label: 'Games', icon: '🎮' },
    { key: 'items', label: 'Items', icon: '📦' },
    { key: 'users', label: 'Users', icon: '👥' },
  ];

  return (
    <div className="admin-layout">
      {/* Toast */}
      {toast && <div className={`admin-toast admin-toast--${toast.type}`}>{toast.msg}</div>}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-brand-icon">◆</span>
          <span className="admin-brand-text">Rast7 Admin</span>
        </div>
        <nav className="admin-sidebar-nav">
          {TABS.map(t => (
            <button key={t.key} className={`admin-nav-item ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}>
              <span className="admin-nav-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-nav-item" onClick={() => navigate('/')}>
            <span className="admin-nav-icon">←</span>
            <span>Kembali ke Site</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h1 className="admin-page-title">
            {TABS.find(t => t.key === activeTab)?.label || 'Dashboard'}
          </h1>
          <div className="admin-topbar-user">
            <span className="admin-topbar-name">{userData.username}</span>
            <span className="admin-topbar-badge">Admin</span>
          </div>
        </header>

        <div className="admin-content">
          {loading ? (
            <div className="admin-loading">Memuat data...</div>
          ) : error ? (
            <div className="admin-error">{error}</div>
          ) : (
            <>
              {/* === GAMES TAB === */}
              {activeTab === 'games' && (
                <section>
                  <div className="admin-section-header">
                    <p className="admin-section-desc">{games.length} game terdaftar</p>
                    <button className="admin-btn admin-btn-primary" onClick={() => { setGameForm(emptyGameForm); setEditTarget(null); setModal('addGame'); }}>
                      + Tambah Game
                    </button>
                  </div>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Nama</th>
                          <th>Slug</th>
                          <th>Items</th>
                          <th>Logo</th>
                          <th style={{ width: 160 }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {games.length === 0 ? (
                          <tr><td colSpan={5} className="admin-empty">Belum ada game</td></tr>
                        ) : games.map(g => (
                          <tr key={g.id}>
                            <td><span className="admin-game-name">{g.name}</span></td>
                            <td><code className="admin-code">{g.slug}</code></td>
                            <td><span className="admin-badge">{g.itemCount}</span></td>
                            <td>{g.logoUrl ? <img src={g.logoUrl} alt="" className="admin-thumb" /> : '-'}</td>
                            <td>
                              <div className="admin-actions">
                                <button className="admin-btn-sm admin-btn-edit" onClick={() => openEditGame(g.id)}>Edit</button>
                                <button className="admin-btn-sm admin-btn-delete" onClick={() => handleDeleteGame(g.id)}>Hapus</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* === ITEMS TAB === */}
              {activeTab === 'items' && (
                <section>
                  <div className="admin-section-header">
                    <p className="admin-section-desc">Kelola item top-up per game</p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <select className="admin-select" value={selectedGame || ''} onChange={e => setSelectedGame(e.target.value)}>
                        <option value="">Pilih Game</option>
                        {games.map(g => <option key={g.id} value={g.id}>{g.name} ({g.itemCount} items)</option>)}
                      </select>
                      {selectedGame && (
                        <button className="admin-btn admin-btn-primary" onClick={() => { setItemForm(emptyItemForm); setEditTarget(null); setModal('addItem'); }}>
                          + Tambah Item
                        </button>
                      )}
                    </div>
                  </div>
                  {!selectedGame ? (
                    <div className="admin-empty-state">Pilih game terlebih dahulu untuk melihat items</div>
                  ) : (
                    <div className="admin-table-wrap">
                      <div style={{ marginBottom: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>
                        Items untuk: <strong style={{ color: '#e2e8f0' }}>{activeGame?.name}</strong>
                      </div>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Nama Item</th>
                            <th>Qty</th>
                            <th>Harga Asli</th>
                            <th>Diskon</th>
                            <th>Harga Final</th>
                            <th style={{ width: 160 }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gameItems.length === 0 ? (
                            <tr><td colSpan={6} className="admin-empty">Belum ada item untuk game ini</td></tr>
                          ) : gameItems.map((item, idx) => (
                            <tr key={idx}>
                              <td><span className="admin-game-name">{item.itemName}</span></td>
                              <td>{item.qty}</td>
                              <td>Rp {formatPrice(item.originalPrice)}</td>
                              <td><span className="admin-badge-discount">{item.discountPercent}%</span></td>
                              <td><span className="admin-price">Rp {formatPrice(item.finalPrice)}</span></td>
                              <td>
                                <div className="admin-actions">
                                  <button className="admin-btn-sm admin-btn-edit" onClick={() => openEditItem(item)}>Edit</button>
                                  <button className="admin-btn-sm admin-btn-delete" onClick={() => handleDeleteItem(item.itemName)}>Hapus</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )}

              {/* === USERS TAB === */}
              {activeTab === 'users' && (
                <section>
                  <div className="admin-section-header">
                    <p className="admin-section-desc">{users.length} user terdaftar</p>
                  </div>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Level</th>
                          <th>Points</th>
                          <th>Bergabung</th>
                          <th>Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr><td colSpan={6} className="admin-empty">Belum ada user</td></tr>
                        ) : users.map(u => (
                          <tr key={u.id}>
                            <td><span className="admin-game-name">{u.username}</span></td>
                            <td>{u.email}</td>
                            <td>{u.level || 1}</td>
                            <td>{u.points ?? 0}</td>
                            <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{u.joinDate || '-'}</td>
                            <td>{u.isAdmin ? <span className="admin-role-badge">Admin</span> : <span className="admin-role-badge admin-role-badge--user">User</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {/* === MODALS === */}
      {modal === 'addGame' && (
        <Modal title="Tambah Game Baru" onClose={() => setModal(null)}>
          <form onSubmit={handleCreateGame}>
            <Input label="Nama Game" value={gameForm.name} onChange={v => setGameForm(p => ({ ...p, name: v }))} required placeholder="Mobile Legends" />
            <Input label="Slug" value={gameForm.slug} onChange={v => setGameForm(p => ({ ...p, slug: v }))} required placeholder="mlbb" />
            <Input label="Logo URL" value={gameForm.logoUrl} onChange={v => setGameForm(p => ({ ...p, logoUrl: v }))} placeholder="https://example.com/logo.png" />
            <Input label="Item Icon URL" value={gameForm.itemIconUrl} onChange={v => setGameForm(p => ({ ...p, itemIconUrl: v }))} placeholder="https://example.com/icon.png" />
            <Input label="Background URL" value={gameForm.bgUrl} onChange={v => setGameForm(p => ({ ...p, bgUrl: v }))} placeholder="https://example.com/bg.jpg" />
            <Input label="Background Position" value={gameForm.bgPosition} onChange={v => setGameForm(p => ({ ...p, bgPosition: v }))} placeholder="center top" />
            <div className="admin-field">
              <label>Zona ID</label>
              <select value={gameForm.hasZone} onChange={e => setGameForm(p => ({ ...p, hasZone: e.target.value === 'true' }))}>
                <option value="true">Ya — Game ini punya zone/server ID</option>
                <option value="false">Tidak — Hanya user ID saja</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModal(null)}>Batal</button>
              <button type="submit" className="admin-btn admin-btn-primary">Simpan</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'editGame' && (
        <Modal title="Edit Game" onClose={() => setModal(null)}>
          <form onSubmit={handleUpdateGame}>
            <Input label="Nama Game" value={gameForm.name} onChange={v => setGameForm(p => ({ ...p, name: v }))} required />
            <Input label="Slug" value={gameForm.slug} onChange={v => setGameForm(p => ({ ...p, slug: v }))} required />
            <Input label="Logo URL" value={gameForm.logoUrl} onChange={v => setGameForm(p => ({ ...p, logoUrl: v }))} />
            <Input label="Item Icon URL" value={gameForm.itemIconUrl} onChange={v => setGameForm(p => ({ ...p, itemIconUrl: v }))} />
            <Input label="Background URL" value={gameForm.bgUrl} onChange={v => setGameForm(p => ({ ...p, bgUrl: v }))} />
            <Input label="Background Position" value={gameForm.bgPosition} onChange={v => setGameForm(p => ({ ...p, bgPosition: v }))} />
            <div className="admin-field">
              <label>Zona ID</label>
              <select value={gameForm.hasZone} onChange={e => setGameForm(p => ({ ...p, hasZone: e.target.value === 'true' }))}>
                <option value="true">Ya</option>
                <option value="false">Tidak</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModal(null)}>Batal</button>
              <button type="submit" className="admin-btn admin-btn-primary">Update</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'addItem' && (
        <Modal title="Tambah Item Baru" onClose={() => setModal(null)}>
          <form onSubmit={handleAddItem}>
            <Input label="Nama Item" value={itemForm.itemName} onChange={v => setItemForm(p => ({ ...p, itemName: v }))} required placeholder="100 Diamonds" />
            <Input label="Quantity" type="number" value={itemForm.qty} onChange={v => setItemForm(p => ({ ...p, qty: v }))} required placeholder="86" />
            <Input label="Harga Asli (Rp)" type="number" value={itemForm.originalPrice} onChange={v => setItemForm(p => ({ ...p, originalPrice: v }))} required placeholder="100000" />
            <Input label="Diskon (%)" type="number" value={itemForm.discountPercent} onChange={v => setItemForm(p => ({ ...p, discountPercent: v }))} placeholder="0" />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModal(null)}>Batal</button>
              <button type="submit" className="admin-btn admin-btn-primary">Simpan</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'editItem' && (
        <Modal title="Edit Item" onClose={() => setModal(null)}>
          <form onSubmit={handleUpdateItem}>
            <Input label="Nama Item" value={itemForm.itemName} onChange={v => setItemForm(p => ({ ...p, itemName: v }))} required />
            <Input label="Quantity" type="number" value={itemForm.qty} onChange={v => setItemForm(p => ({ ...p, qty: v }))} required />
            <Input label="Harga Asli (Rp)" type="number" value={itemForm.originalPrice} onChange={v => setItemForm(p => ({ ...p, originalPrice: v }))} required />
            <Input label="Diskon (%)" type="number" value={itemForm.discountPercent} onChange={v => setItemForm(p => ({ ...p, discountPercent: v }))} />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModal(null)}>Batal</button>
              <button type="submit" className="admin-btn admin-btn-primary">Update</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
