import { ApiPropertyOptional } from '@nestjs/swagger'

export type GraphPeriod = 'day' | 'month' | 'year'

export class GraphQueryDto {
  @ApiPropertyOptional({ example: 3 })
  shift?: number

  @ApiPropertyOptional({ example: '2026-07-01' })
  production_date?: string

  @ApiPropertyOptional({ enum: ['day', 'month', 'year'], default: 'day' })
  period?: GraphPeriod

  @ApiPropertyOptional({ example: '2024-01-01' })
  date_from?: string

  @ApiPropertyOptional({ example: '2024-01-31' })
  date_to?: string

  @ApiPropertyOptional({ example: 'Горная масса' })
  indicator?: string
}
