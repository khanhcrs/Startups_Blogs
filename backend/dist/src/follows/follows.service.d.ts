import { PrismaService } from '../prisma/prisma.service';
export declare class FollowsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(followingId: string, followerId: string): Promise<{
        id: string;
        createdAt: Date;
        followerId: string;
        followingId: string;
    }>;
    remove(followingId: string, followerId: string): Promise<{
        id: string;
        createdAt: Date;
        followerId: string;
        followingId: string;
    }>;
    getFollowers(userId: string): Promise<({
        follower: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        followerId: string;
        followingId: string;
    })[]>;
    getFollowing(userId: string): Promise<({
        following: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        followerId: string;
        followingId: string;
    })[]>;
}
