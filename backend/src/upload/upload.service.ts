import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';
import { extname } from 'path';

@Injectable()
export class UploadService implements OnModuleInit {
  private s3Client: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET || 'startups-blogs-bucket';
  private endpoint = process.env.AWS_S3_ENDPOINT || 'http://127.0.0.1:9000';

  constructor() {
    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region: process.env.AWS_S3_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY || 'admin',
        secretAccessKey: process.env.AWS_S3_SECRET_KEY || 'admin123password',
      },
      forcePathStyle: true, // Bắt buộc true khi dùng MinIO
    });
  }

  async onModuleInit() {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
        
        // Thiết lập Public Read Policy để trình duyệt có thể truy cập URL ảnh
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
        await this.s3Client.send(new PutBucketPolicyCommand({
          Bucket: this.bucketName,
          Policy: JSON.stringify(policy)
        })).catch(console.error); // Ignore error if policy fails in some minio configs
      }
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      
      return `${this.endpoint}/${this.bucketName}/${fileName}`;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error uploading file to S3/MinIO');
    }
  }
}
