import { Module } from '@nestjs/common';
import { InvestorsController } from './investors.controller';
@Module({ controllers: [InvestorsController] })
export class InvestorsModule {}
