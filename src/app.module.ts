import { Module } from '@nestjs/common'

import { BusinessUnitsModule } from './business-units/business-units.module'
import { HealthModule } from './health/health.module'
import { ProductionStagesModule } from './production-stages/production-stages.module'

@Module({
  imports: [HealthModule, BusinessUnitsModule, ProductionStagesModule]
})
export class AppModule {}