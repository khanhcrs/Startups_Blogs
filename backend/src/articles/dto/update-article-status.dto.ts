import { IsIn } from 'class-validator';

export const ARTICLE_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export class UpdateArticleStatusDto {
  @IsIn(ARTICLE_STATUSES)
  status: ArticleStatus;
}
