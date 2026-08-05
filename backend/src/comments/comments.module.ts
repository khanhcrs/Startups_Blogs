import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController, CommentsRootController } from './comments.controller';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController, CommentsRootController]
})
export class CommentsModule {}
