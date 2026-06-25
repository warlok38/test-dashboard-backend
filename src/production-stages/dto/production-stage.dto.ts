import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class DashboardMetricDto {
  @ApiProperty({ example: 'mining-rock-mass' })
  id!: string

  @ApiProperty({ example: 'Горная масса, тыс. м3' })
  title!: string

  @ApiProperty({ nullable: true, example: 312.8 })
  value!: number | null

  @ApiProperty({ nullable: true, example: 298.5 })
  plan!: number | null

  @ApiProperty({ nullable: true, example: 4.8 })
  delta!: number | null

  @ApiPropertyOptional({ example: '/production-stages/mining/rock-mass' })
  detailRoute?: string

  @ApiPropertyOptional({ example: 1 })
  valueFractionDigits?: number

  @ApiPropertyOptional({ example: 1 })
  planFractionDigits?: number

  @ApiPropertyOptional({ example: 1 })
  deltaFractionDigits?: number

  @ApiProperty({ enum: ['success', 'danger', 'neutral'], example: 'success' })
  status!: 'success' | 'danger' | 'neutral'
}

export class DashboardStagePlanDto {
  @ApiProperty({ example: 2 })
  completed!: number

  @ApiProperty({ example: 4 })
  total!: number
}

export class DashboardStageDto {
  @ApiProperty({ example: 'mining' })
  id!: string

  @ApiProperty({ example: 'Добыча' })
  title!: string

  @ApiPropertyOptional({ example: '/production-stages/mining' })
  detailRoute?: string

  @ApiProperty({ type: DashboardStagePlanDto })
  plan!: DashboardStagePlanDto

  @ApiProperty({ type: DashboardMetricDto, isArray: true })
  metrics!: DashboardMetricDto[]
}