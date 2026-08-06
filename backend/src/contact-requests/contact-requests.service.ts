import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ContactRequestsService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) {}

  async create(data: { businessId: string; senderId: string; title: string; message: string }) {
    const business = await this.prisma.business.findUnique({
      where: { id: data.businessId },
    });
    
    if (!business) {
      throw new NotFoundException('Doanh nghiệp không tồn tại');
    }

    const contactRequest = await this.prisma.contactRequest.create({
      data: {
        title: data.title,
        message: data.message,
        senderId: data.senderId,
        businessId: data.businessId,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true, email: true },
        },
      }
    });

    // Notify the business owner
    await this.notificationsService.createNotification({
      userId: business.ownerId,
      title: 'Yêu cầu liên hệ mới',
      message: `Bạn nhận được một yêu cầu liên hệ mới từ ${contactRequest.sender.name} cho startup ${business.name}.`,
      type: 'CONTACT_REQUEST',
    });

    return contactRequest;
  }

  async findByBusiness(businessId: string, userId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Doanh nghiệp không tồn tại');
    }

    if (business.ownerId !== userId) {
      // Allow admin as well, but for now simple owner check
      throw new UnauthorizedException('Bạn không có quyền xem thông tin này');
    }

    return this.prisma.contactRequest.findMany({
      where: { businessId },
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
