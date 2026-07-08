import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { ProductionStagesController } from './production-stages.controller'
import { ProductionStagesService } from './production-stages.service'

@Module({
  imports: [AuthModule],
  controllers: [ProductionStagesController],
  providers: [ProductionStagesService]
})
export class ProductionStagesModule {}
