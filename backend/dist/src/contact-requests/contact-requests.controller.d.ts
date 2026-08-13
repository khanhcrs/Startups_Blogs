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
        title: string;
        businessId: string;
        createdAt: Date;
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
        title: string;
        businessId: string;
        createdAt: Date;
        message: string;
        updatedAt: Date;
        senderId: string;
    })[]>;
}
