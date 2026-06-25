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

export default function Modal({ title, children, onClose }) {
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
