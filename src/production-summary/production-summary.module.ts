import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { ProductionSummaryController } from './production-summary.controller'
import { ProductionSummaryService } from './production-summary.service'

@Module({
  imports: [AuthModule],
  controllers: [ProductionSummaryController],
  providers: [ProductionSummaryService]
})
export class ProductionSummaryModule {}
