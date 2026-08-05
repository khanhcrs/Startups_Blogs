import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import commonStyles from '../AdminCommon.module.css';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/users/admin/all?limit=50', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`http://localhost:3000/users/admin/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) throw new Error('Failed to update role');
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error('Error updating role');
    }
  };

  return (
    <div>
      <header className={commonStyles.header}>
        <h1>User Management</h1>
        <p>Manage user roles and accounts</p>
      </header>
      <div className={commonStyles.contentCard}>
        <div className={commonStyles.listContainer}>
          {loading ? <div className={commonStyles.loading}>Loading...</div> : (
            <div className={commonStyles.tableWrapper}>
              <table className={commonStyles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px', 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold',
                          background: u.role === 'ADMIN' ? '#fee2e2' : u.role === 'MODERATOR' ? '#fef3c7' : '#e0e7ff',
                          color: u.role === 'ADMIN' ? '#991b1b' : u.role === 'MODERATOR' ? '#92400e' : '#3730a3'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td>{new Date(u.joinedAt || u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select 
                          value={u.role} 
                          onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                          className={commonStyles.selectInput}
                        >
                          <option value="USER">User</option>
                          <option value="MODERATOR">Moderator</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
