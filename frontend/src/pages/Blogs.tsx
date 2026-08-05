import { Link } from 'react-router-dom';
import styles from './Blogs.module.css';
import { getInitials } from '../utils/stringUtils';
import { api } from '../lib/axios';
import { useState, useEffect } from 'react';
import { ArticleSkeleton, FeaturedArticleSkeleton } from '../components/ArticleSkeleton';
import toast from 'react-hot-toast';
import ArticleCard from '../components/ArticleCard';

import { Search } from 'lucide-react';

const Blogs = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    setIsLoading(true);
    const skip = (currentPage - 1) * limit;
    
    let query = `/articles?category=Blog&take=${limit}&skip=${skip}`;
    if (selectedTag) query += `&tag=${encodeURIComponent(selectedTag)}`;
    if (searchQuery) query += `&search=${encodeURIComponent(searchQuery)}`;
    if (startDate) query += `&startDate=${encodeURIComponent(startDate)}`;
    if (endDate) query += `&endDate=${encodeURIComponent(endDate)}`;

    api.get(query)
      .then(res => {
        setArticles(res.data.data);
        setTotal(res.data.total);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch blogs', err);
        toast.error('Failed to load blogs. Please try again later.');
        setArticles([]);
        setTotal(0);
        setIsLoading(false);
      });
  }, [selectedTag, searchQuery, startDate, endDate, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(total / limit);
  const isFiltering = !!(selectedTag || searchQuery || startDate || endDate || currentPage > 1);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const featuredPost = !isFiltering && articles.length > 0 ? articles[0] : null;
  const recentPosts = !isFiltering && articles.length > 1 ? articles.slice(1) : articles;

  return (
    <div className="section">
      <div className="container">
        
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Startup Blogs & Insights</h1>
            <p className={styles.subtitle}>Founder stories, growth strategies, and industry trends.</p>
            
            <form 
              className={styles.searchBox} 
              onSubmit={handleSearchSubmit}
            >
              <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input 
                  type="text" 
                  placeholder="Search blogs by title..." 
                  className={styles.searchInput} 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.searchBtn}>Search</button>
            </form>
          </div>
          <div className={styles.heroImageWrapper}>
            <img 
              src="/images/blog_main_presentation.jpg" 
              alt="Blogs & Insights" 
              className={styles.heroImage} 
            />
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.filtersGroup}>
            <select 
              value={selectedTag || ''} 
              onChange={(e) => setSelectedTag(e.target.value || null)}
              className={styles.filterDropdown}
            >
              <option value="">All Topics</option>
              <option value="Venture Capital">Venture Capital</option>
              <option value="Productivity">Productivity</option>
              <option value="Growth">Growth</option>
              <option value="Marketing">Marketing</option>
              <option value="AI">AI</option>
              <option value="Leadership">Leadership</option>
              <option value="Design">Design</option>
            </select>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              title="Start Date"
              className={styles.dateInput}
            />
            <span style={{ color: 'var(--text-muted)' }}>-</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              title="End Date"
              className={styles.dateInput}
            />
            {isFiltering && (
              <button 
                type="button" 
                onClick={() => { setSearchInput(''); setSearchQuery(''); setStartDate(''); setEndDate(''); setSelectedTag(null); setCurrentPage(1); }} 
                className={styles.filterDropdown}
                style={{ background: 'var(--error-50)', color: 'var(--error-600)', borderColor: 'var(--error-200)' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className={styles.mainLayout}>
          <div className={styles.feed}>
            {isLoading && articles.length === 0 ? (
              <FeaturedArticleSkeleton />
            ) : featuredPost ? (
              <Link to={`/blogs/${featuredPost.slug}`} className={styles.featuredCard}>
                <div 
                  className={styles.featuredImage} 
                  style={{ backgroundImage: `url(${featuredPost.coverImage || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80'})` }} 
                />
                <div className={styles.featuredContent}>
                  <div className={styles.featuredMeta}>
                    <span className={styles.tag}>{featuredPost.category}</span>
                    <span>{formatDate(featuredPost.publishedAt || featuredPost.createdAt)}</span>
                    <span>•</span>
                    <span>5 min read</span>
                  </div>
                  <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                  <p className={styles.featuredSummary}>{featuredPost.summary}</p>
                  
                  <div className={styles.authorRow}>
                    <div className={styles.avatarSmall}>{getInitials(featuredPost.author?.name || 'A')}</div>
                    <span style={{ fontWeight: 500 }}>{featuredPost.author?.name || 'Anonymous'}</span>
                  </div>
                </div>
              </Link>
            ) : null}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-4)', marginBottom: 'var(--spacing-2)' }}>
              <h3 style={{ margin: 0 }}>{selectedTag ? `Articles matching "${selectedTag}"` : 'Recent Articles'}</h3>
              {selectedTag && (
                <button 
                  onClick={() => setSelectedTag(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-500)', cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  Clear filter
                </button>
              )}
            </div>
            
            <div className={styles.articleList}>
              {recentPosts.length > 0 ? (
                recentPosts.map(article => (
                  <ArticleCard key={article.id} article={article} variant="list" />
                ))
              ) : (
                !isLoading && featuredPost === null && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No blogs available matching your criteria.
                  </div>
                )
              )}
              {isLoading && articles.length > 0 && (
                Array.from({ length: 4 }).map((_, idx) => (
                  <ArticleSkeleton key={`recent-skel-${idx}`} />
                ))
              )}
            </div>
            
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface-color)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      borderRadius: 'var(--radius-md)', 
                      border: page === currentPage ? '1px solid var(--primary-500)' : '1px solid var(--border-color)', 
                      background: page === currentPage ? 'var(--primary-500)' : 'var(--surface-color)', 
                      color: page === currentPage ? 'white' : 'inherit',
                      cursor: 'pointer' 
                    }}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface-color)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Popular Topics</h3>
              <div className={styles.tagsContainer}>
                {['Fundraising', 'Growth', 'Product', 'Leadership', 'Marketing', 'Culture', 'Sales'].map(tag => (
                  <span 
                    key={tag} 
                    className={styles.tagPill}
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    style={tag === selectedTag ? { backgroundColor: 'var(--primary-500)', color: 'white', borderColor: 'var(--primary-500)' } : {}}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Top Authors</h3>
              <div className={styles.authorList}>
                {Array.from(
                  new Map(
                    articles
                      .filter(a => a.author && a.author.id)
                      .map(a => [a.author.id, a.author])
                  ).values()
                ).slice(0, 5).map((author: any, idx) => (
                  <Link to={`/user/${author.id}`} key={idx} className={styles.authorItem} style={{ textDecoration: 'none', color: 'inherit', alignItems: 'center', padding: '0.5rem 0' }}>
                    <div className={styles.avatarSmall} style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>{getInitials(author.name)}</div>
                    <div style={{ flex: 1, marginLeft: '8px' }}>
                      <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{author.name}</div>
                      <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Author</div>
                    </div>
                    <button className={styles.followBtnSmall} style={{ padding: '6px 16px', fontSize: '0.875rem' }}>Follow</button>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
