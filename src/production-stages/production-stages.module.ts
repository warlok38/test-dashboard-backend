import { Module } from '@nestjs/common'

import { ProductionStagesController } from './production-stages.controller'
import { ProductionStagesService } from './production-stages.service'

@Module({
  controllers: [ProductionStagesController],
  providers: [ProductionStagesService]
})
export class ProductionStagesModule {}