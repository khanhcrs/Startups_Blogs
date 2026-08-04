import { Search, Bell, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import styles from './Notifications.module.css';

const Notifications = () => {
  const [filter, setFilter] = useState('All');
  const [showBanner, setShowBanner] = useState(true);

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
          <button className={styles.refreshBtn}>
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
              <span className={styles.statValue}>7</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{backgroundColor: '#EFF6FF', color: '#3B82F6'}}>
              <Bell size={18} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>UNREAD</span>
              <span className={styles.statValue}>4</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{backgroundColor: '#ECFDF5', color: '#10B981'}}>
              <CheckCircle2 size={18} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>READ</span>
              <span className={styles.statValue}>3</span>
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
                Unread <span className={styles.filterBadge}>4</span>
              </button>
              <button className={`${styles.filterBtn} ${filter === 'Read' ? styles.active : ''}`} onClick={() => setFilter('Read')}>Read</button>
            </div>
            <button className={styles.markReadBtn}>
              <CheckCircle2 size={16} /> Mark all as read
            </button>
          </div>
        </div>

        <div className={styles.list}>
          
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Bell size={18} />
            </div>
            <div className={styles.cardContent}>
              <h3>THÔNG BÁO NGHỈ</h3>
              <p>Tất cả các bạn sinh viên được nghỉ (không lên văn phòng) vào ngày Thứ 5 30/07/2026</p>
              <div className={styles.cardMeta}>
                <span className={styles.time}>5 days ago</span>
                <span className={styles.badge}>ANNOUNCEMENT</span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Bell size={18} />
            </div>
            <div className={styles.cardContent}>
              <h3>Swinburne Cloud Mastery sẽ diễn ra vào thứ 7 tuần này (4/7/2026)</h3>
              <p>Chào mừng các bạn đến với Swinburne Cloud Mastery diễn ra vào thứ 7 tuần này (4/7/2026) – sự kiện chia sẻ kiến thức, kỹ năng và kinh nghiệm thực chiến về Điện toán đám mây. Đây là cơ hội tuyệt vời để kết nối, trao đổi ý tưởng và tiếp thu những góc nhìn chuyên sâu, mang lại giá trị thiết thực cho quá trình học tập và định hướng nghề nghiệp của bạn.</p>
              <div className={styles.cardMeta}>
                <span className={styles.time}>6/29/2026</span>
                <span className={styles.badge}>ANNOUNCEMENT</span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Bell size={18} />
            </div>
            <div className={styles.cardContent}>
              <h3>THÔNG BÁO VỀ VIỆC THỜI GIAN LÊN VĂN PHÒNG</h3>
              <p>Chào các bạn sinh viên, Phía team security có feedback lại với team admin FCAJ là các bạn đi quá sớm (trước 8h30). Các bạn lưu ý giúp team là 8h30 có mặt là vừa nha. Đừng đi sớm hơn, sẽ không được mở cửa vào văn phòng. Rất mong các bạn sinh viên đọc thông báo và làm đúng quy định của tòa nhà. Cảm ơn các bạn</p>
              <div className={styles.cardMeta}>
                <span className={styles.time}>6/16/2026</span>
                <span className={styles.badge}>ANNOUNCEMENT</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Notifications;
