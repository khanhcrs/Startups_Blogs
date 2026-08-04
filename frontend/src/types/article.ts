export type ArticleStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';

export interface AuthorInfo {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  businessId?: string;
  businessName?: string;
  followersCount?: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // Markdown or HTML
  coverImage?: string;
  status: ArticleStatus;
  category: string;
  tags: string[];
  author: AuthorInfo;
  createdAt: string;
  publishedAt?: string;
  likesCount: number;
  bookmarksCount: number;
  commentsCount: number;
  viewCount: number;
}

export interface Comment {
  id: string;
  articleId: string;
  content: string;
  author: AuthorInfo;
  parentId?: string; // For nested replies
  createdAt: string;
  replies?: Comment[];
}
