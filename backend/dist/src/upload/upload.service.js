"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const path_1 = require("path");
let UploadService = class UploadService {
    s3Client;
    bucketName = process.env.AWS_S3_BUCKET || 'startups-blogs-bucket';
    endpoint = process.env.AWS_S3_ENDPOINT || 'http://127.0.0.1:9000';
    constructor() {
        this.s3Client = new client_s3_1.S3Client({
            endpoint: this.endpoint,
            region: process.env.AWS_S3_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_S3_ACCESS_KEY || 'admin',
                secretAccessKey: process.env.AWS_S3_SECRET_KEY || 'admin123password',
            },
            forcePathStyle: true,
        });
    }
    async onModuleInit() {
        try {
            await this.s3Client.send(new client_s3_1.HeadBucketCommand({ Bucket: this.bucketName }));
        }
        catch (error) {
            if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
                await this.s3Client.send(new client_s3_1.CreateBucketCommand({ Bucket: this.bucketName }));
                const policy = {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: '*',
                            Action: ['s3:GetObject'],
                            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                        },
                    ],
                };
                await this.s3Client.send(new client_s3_1.PutBucketPolicyCommand({
                    Bucket: this.bucketName,
                    Policy: JSON.stringify(policy)
                })).catch(console.error);
            }
        }
    }
    async uploadFile(file) {
        const fileExtension = (0, path_1.extname)(file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;
        try {
            await this.s3Client.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            }));
            return `${this.endpoint}/${this.bucketName}/${fileName}`;
        }
        catch (error) {
            console.error(error);
            throw new common_1.InternalServerErrorException('Error uploading file to S3/MinIO');
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map