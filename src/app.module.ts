import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { BusinessUnitsModule } from './business-units/business-units.module'
import { HealthModule } from './health/health.module'
import { ProductionStagesModule } from './production-stages/production-stages.module'
import { ProductionSummaryModule } from './production-summary/production-summary.module'

@Module({
  imports: [
    HealthModule,
    AuthModule,
    BusinessUnitsModule,
    ProductionStagesModule,
    ProductionSummaryModule
  ]
})
export class AppModule {}
