import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, FileText, CheckCircle, MessageSquare, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      navigate('/403');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  const getMenuClass = (path: string) => {
    return location.pathname.includes(path) ? `${styles.menuItem} ${styles.activeMenuItem}` : styles.menuItem;
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Admin Panel</div>
        <nav>
          <Link to="/admin/overview" className={getMenuClass('overview')}>
            <LayoutDashboard size={20} /> Overview
          </Link>
          <Link to="/admin/businesses" className={getMenuClass('businesses')}>
            <Building2 size={20} /> Businesses
          </Link>
          <Link to="/admin/users" className={getMenuClass('users')}>
            <Users size={20} /> Users
          </Link>
          <Link to="/admin/articles" className={getMenuClass('articles')}>
            <FileText size={20} /> Articles
          </Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
