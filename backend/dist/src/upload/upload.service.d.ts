import { OnModuleInit } from '@nestjs/common';
export declare class UploadService implements OnModuleInit {
    private s3Client;
    private bucketName;
    private endpoint;
    constructor();
    onModuleInit(): Promise<void>;
    uploadFile(file: Express.Multer.File): Promise<string>;
}
