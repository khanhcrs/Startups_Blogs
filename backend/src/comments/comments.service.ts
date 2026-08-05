import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(articleId: string, createCommentDto: CreateCommentDto, authorId: string) {
    const article = await this.prisma.article.findUnique({ where: { id: articleId } });
    if (!article) throw new NotFoundException('Article not found');

    if (createCommentDto.parentId) {
      const parent = await this.prisma.comment.findUnique({ where: { id: createCommentDto.parentId } });
      if (!parent) throw new NotFoundException('Parent comment not found');
    }

    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        authorId,
        articleId,
        parentId: createCommentDto.parentId || null,
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } }
      }
    });
  }

  async findAllByArticle(articleId: string) {
    return this.prisma.comment.findMany({
      where: { articleId, parentId: null },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        replies: {
          include: {
            author: { select: { id: true, name: true, avatarUrl: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  async update(id: string, content: string, authorId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== authorId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    return this.prisma.comment.update({
      where: { id },
      data: { content },
    });
  }

  async removeAdmin(id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    return this.prisma.comment.delete({ where: { id } });
  }

  async remove(id: string, requesterId: string) {
    const comment = await this.prisma.comment.findUnique({ 
      where: { id },
      include: { article: { select: { authorId: true } } }
    });
    
    if (!comment) throw new NotFoundException('Comment not found');
    
    const isCommentAuthor = comment.authorId === requesterId;
    const isArticleAuthor = comment.article.authorId === requesterId;

    if (!isCommentAuthor && !isArticleAuthor) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }

    return this.prisma.comment.delete({ where: { id } });
  }
}
