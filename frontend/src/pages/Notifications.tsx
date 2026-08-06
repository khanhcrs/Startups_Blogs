import { Search, Bell, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import styles from './Notifications.module.css';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const Notifications = () => {
  const [filter, setFilter] = useState('All');
  const [showBanner, setShowBanner] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'Unread') return !n.isRead;
    if (filter === 'Read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const readCount = notifications.filter(n => n.isRead).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconContainer}>
              <Bell size={24} color="#F97316" />
            </div>
            <div>
              <h1 className={styles.title}>Notifications</h1>
              <p className={styles.subtitle}>Stay updated with your latest notifications and announcements</p>
            </div>
          </div>
          <button className={styles.refreshBtn} onClick={fetchNotifications}>
            Refresh
          </button>
        </div>

        {showBanner && (
          <div className={styles.banner}>
            <div className={styles.bannerContent}>
              <div className={styles.bannerIcon}>
                <Bell size={18} color="white" />
              </div>
              <div>
                <h4>Enable browser notifications</h4>
                <p>Get notified about your bookings, new job openings and point updates even when this site is closed.</p>
              </div>
            </div>
            <div className={styles.bannerActions}>
              <button className={styles.bannerBtnSecondary} onClick={() => setShowBanner(false)}>Not now</button>
              <button className={styles.bannerBtnPrimary}>Allow</button>
            </div>
          </div>
        )}

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{backgroundColor: '#FFF7ED', color: '#F97316'}}>
              <Bell size={18} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>TOTAL</span>
              <span className={styles.statValue}>{notifications.length}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{backgroundColor: '#EFF6FF', color: '#3B82F6'}}>
              <Bell size={18} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>UNREAD</span>
              <span className={styles.statValue}>{unreadCount}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{backgroundColor: '#ECFDF5', color: '#10B981'}}>
              <CheckCircle2 size={18} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>READ</span>
              <span className={styles.statValue}>{readCount}</span>
            </div>
          </div>
        </div>

        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Search notifications..." className={styles.searchInput} />
          </div>
          
          <div className={styles.filterActions}>
            <div className={styles.filterGroup}>
              <button className={`${styles.filterBtn} ${filter === 'All' ? styles.active : ''}`} onClick={() => setFilter('All')}>All</button>
              <button className={`${styles.filterBtn} ${filter === 'Unread' ? styles.active : ''}`} onClick={() => setFilter('Unread')}>
                Unread <span className={styles.filterBadge}>{unreadCount}</span>
              </button>
              <button className={`${styles.filterBtn} ${filter === 'Read' ? styles.active : ''}`} onClick={() => setFilter('Read')}>Read</button>
            </div>
            <button className={styles.markReadBtn} onClick={handleMarkAllAsRead}>
              <CheckCircle2 size={16} /> Mark all as read
            </button>
          </div>
        </div>

        <div className={styles.list}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Loading notifications...</p>
          ) : filteredNotifications.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No notifications found.</p>
          ) : (
            filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`${styles.card} ${!notif.isRead ? styles.unread : ''}`}
                onClick={() => handleMarkAsRead(notif.id, notif.isRead)}
                style={{ cursor: notif.isRead ? 'default' : 'pointer', opacity: notif.isRead ? 0.8 : 1 }}
              >
                <div className={styles.cardIcon}>
                  {notif.type === 'ANNOUNCEMENT' ? <Bell size={18} color="#F97316" /> : 
                   notif.type === 'SYSTEM' ? <Bell size={18} color="#3B82F6" /> : 
                   <Bell size={18} />}
                </div>
                <div className={styles.cardContent}>
                  <h3>{notif.title}</h3>
                  <p>{notif.message}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.time}>{formatDate(notif.createdAt)}</span>
                    <span className={styles.badge}>{notif.type}</span>
                    {!notif.isRead && (
                      <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 600 }}>New</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
