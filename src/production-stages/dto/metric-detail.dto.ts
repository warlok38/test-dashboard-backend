import { ApiProperty } from '@nestjs/swagger'

export class BusinessUnitSummaryDto {
  @ApiProperty({ example: 'olimpiada' })
  slug!: string

  @ApiProperty({ example: 'Олимпиада' })
  title!: string

  @ApiProperty({ nullable: true, example: 259.19 })
  fact!: number | null

  @ApiProperty({ example: 242.22 })
  plan!: number
}

export class MetricTrendPointDto {
  @ApiProperty({ example: '10' })
  day!: string

  @ApiProperty({ example: 'Май' })
  month!: string

  @ApiProperty({ example: 296 })
  fact!: number

  @ApiProperty({ example: 323 })
  plan!: number
}

export class ProductionMetricDetailDto {
  @ApiProperty({ example: 'mining' })
  stageSlug!: string

  @ApiProperty({ example: 'Добыча' })
  stageTitle!: string

  @ApiProperty({ example: 'rock-mass' })
  metricSlug!: string

  @ApiProperty({ example: 'Горная масса' })
  metricTitle!: string

  @ApiProperty({ example: 'тыс. м3' })
  unit!: string

  @ApiProperty({ type: BusinessUnitSummaryDto, isArray: true })
  summaries!: BusinessUnitSummaryDto[]

  @ApiProperty({ type: MetricTrendPointDto, isArray: true })
  trend!: MetricTrendPointDto[]
}