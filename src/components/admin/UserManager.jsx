export default function UserManager({ users }) {
  return (
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
                <td>{u.isAdmin
                  ? <span className="admin-role-badge">Admin</span>
                  : <span className="admin-role-badge admin-role-badge--user">User</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
