import { ContactRequestsService } from './contact-requests.service';
export declare class ContactRequestsController {
    private readonly contactRequestsService;
    constructor(contactRequestsService: ContactRequestsService);
    createContactRequest(businessId: string, body: {
        title: string;
        message: string;
    }, req: any): Promise<{
        sender: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        title: string;
        businessId: string;
        message: string;
        updatedAt: Date;
        senderId: string;
    }>;
    getContactRequests(businessId: string, req: any): Promise<({
        sender: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        title: string;
        businessId: string;
        message: string;
        updatedAt: Date;
        senderId: string;
    })[]>;
}
