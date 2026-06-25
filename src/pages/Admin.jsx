import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/api';
import { CACHE_KEYS, getCache, setCache } from '../utils/adminCache';
import GameManager from '../components/admin/GameManager';
import UserManager from '../components/admin/UserManager';
import CategoryManager from '../components/admin/CategoryManager';
import CarouselManager from '../components/admin/CarouselManager';
import PromoManager from '../components/admin/PromoManager';
import MessageManager from '../components/admin/MessageManager';
import VoucherManager from '../components/admin/VoucherManager';
import '../styles/Admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const [userData] = useState(() => {
    const stored = sessionStorage.getItem('currentUser');
    const token = sessionStorage.getItem('authToken');
    if (!stored || !token) return null;
    try {
      const u = JSON.parse(stored);
      if (u.isAdmin) return u;
    } catch { /* ignore */ }
    return null;
  });
  const [activeTab, setActiveTab] = useState('games');
  const [games, setGames] = useState(() => getCache(CACHE_KEYS.GAMES) || []);
  const [users, setUsers] = useState(() => getCache(CACHE_KEYS.USERS) || []);
  const [categories, setCategories] = useState(() => getCache(CACHE_KEYS.CATEGORIES) || []);
  const [carouselSlides, setCarouselSlides] = useState(() => getCache(CACHE_KEYS.SLIDES) || []);
  const [promos, setPromos] = useState(() => getCache(CACHE_KEYS.PROMOS) || []);
  const [promoBanners, setPromoBanners] = useState(() => getCache(CACHE_KEYS.BANNERS) || []);
  const [contactMessages, setContactMessages] = useState(() => getCache(CACHE_KEYS.CONTACT) || []);
  const [vouchers, setVouchers] = useState(() => getCache(CACHE_KEYS.VOUCHERS) || []);
  const [loading, setLoading] = useState(() => {
    const keys = ['games', 'users', 'categories', 'slides', 'promos', 'banners', 'contact', 'vouchers'];
    return !keys.every(k => sessionStorage.getItem(`admin_cache_${k}`));
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const bumpRefresh = useCallback(() => setRefreshKey(k => k + 1), []);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!userData) navigate('/login');
  }, [userData, navigate]);

  const loadGames = useCallback(async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/games', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) { setGames(json.data); setCache(CACHE_KEYS.GAMES, json.data); }
    } catch {
      if (!getCache(CACHE_KEYS.GAMES)) showToast('Gagal memuat games', 'error');
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) { setUsers(json.data); setCache(CACHE_KEYS.USERS, json.data); }
    } catch {
      if (!getCache(CACHE_KEYS.USERS)) showToast('Gagal memuat users', 'error');
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/categories', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) { setCategories(json.data); setCache(CACHE_KEYS.CATEGORIES, json.data); }
    } catch { /* ignore */ }
  }, []);

  const loadCarouselSlides = useCallback(async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/carousel-slides', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) { setCarouselSlides(json.data); setCache(CACHE_KEYS.SLIDES, json.data); }
    } catch { /* ignore */ }
  }, []);

  const loadPromos = useCallback(async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/promos', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) { setPromos(json.data); setCache(CACHE_KEYS.PROMOS, json.data); }
    } catch {
      if (!getCache(CACHE_KEYS.PROMOS)) showToast('Gagal memuat promos', 'error');
    }
  }, []);

  const loadPromoBanners = useCallback(async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/promo-banners', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) { setPromoBanners(json.data); setCache(CACHE_KEYS.BANNERS, json.data); }
    } catch {
      if (!getCache(CACHE_KEYS.BANNERS)) showToast('Gagal memuat promo banners', 'error');
    }
  }, []);

  const loadContactMessages = useCallback(async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/contact-messages', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) { setContactMessages(json.data); setCache(CACHE_KEYS.CONTACT, json.data); }
    } catch {
      if (!getCache(CACHE_KEYS.CONTACT)) showToast('Gagal memuat pesan masuk', 'error');
    }
  }, []);

  const loadVouchers = useCallback(async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/vouchers', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) { setVouchers(json.data); setCache(CACHE_KEYS.VOUCHERS, json.data); }
    } catch {
      if (!getCache(CACHE_KEYS.VOUCHERS)) showToast('Gagal memuat voucher', 'error');
    }
  }, []);

  useEffect(() => {
    if (!userData) return;
    const timer = setTimeout(() => {
      Promise.all([
        loadGames(), loadUsers(), loadCategories(), loadCarouselSlides(),
        loadPromos(), loadPromoBanners(), loadContactMessages(), loadVouchers()
      ]).finally(() => setLoading(false));
    }, 0);
    return () => clearTimeout(timer);
  }, [userData, loadGames, loadUsers, loadCategories, loadCarouselSlides, loadPromos, loadPromoBanners, loadContactMessages, loadVouchers]);

  if (!userData) return null;

  const TABS = [
    { key: 'games', label: 'Games', icon: '🎮' },
    { key: 'items', label: 'Items', icon: '📦' },
    { key: 'users', label: 'Users', icon: '👥' },
    { key: 'categories', label: 'Categories', icon: '🏷️' },
    { key: 'carousel', label: 'Carousel', icon: '📺' },
    { key: 'promos', label: 'Promos', icon: '🔥' },
    { key: 'messages', label: 'Pesan', icon: '✉️' },
    { key: 'vouchers', label: 'Voucher', icon: '🎟️' },
  ];

  return (
    <div className="admin-layout">
      {toast && <div className={`admin-toast admin-toast--${toast.type}`}>{toast.msg}</div>}

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
          ) : (
            <>
              {['games', 'items'].includes(activeTab) && (
                <GameManager games={games} categories={categories}
                  showToast={showToast} onRefresh={loadGames} refreshKey={refreshKey}
                  onRefreshComplete={bumpRefresh} activeTab={activeTab} />
              )}
              {activeTab === 'users' && <UserManager users={users} />}
              {activeTab === 'categories' && (
                <CategoryManager categories={categories} showToast={showToast} onRefresh={loadCategories} />
              )}
              {activeTab === 'carousel' && (
                <CarouselManager slides={carouselSlides} showToast={showToast} onRefresh={loadCarouselSlides} />
              )}
              {activeTab === 'promos' && (
                <PromoManager promos={promos} banners={promoBanners} showToast={showToast}
                  onRefreshPromos={loadPromos} onRefreshBanners={loadPromoBanners}
                  refreshKey={refreshKey} onRefreshComplete={bumpRefresh} />
              )}
              {activeTab === 'messages' && (
                <MessageManager messages={contactMessages} showToast={showToast} onRefresh={loadContactMessages} />
              )}
              {activeTab === 'vouchers' && (
                <VoucherManager vouchers={vouchers} showToast={showToast} onRefresh={loadVouchers} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
