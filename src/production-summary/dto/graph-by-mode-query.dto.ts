import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { type GraphPeriod } from './graph-query.dto'

export type GraphMode = 'gtk' | 'park' | 'stage' | 'quarry' | 'parkPercent' | 'block'

export class GraphByModeQueryDto {
  @ApiProperty({ example: 'Горная масса' })
  indicator!: string

  @ApiPropertyOptional({ example: 3 })
  shift?: number

  @ApiPropertyOptional({ example: '2026-07-01' })
  production_date?: string

  @ApiPropertyOptional({ example: '2026-07-01' })
  date_from?: string

  @ApiPropertyOptional({ example: '2026-07-31' })
  date_to?: string

  @ApiPropertyOptional({ enum: ['day', 'month', 'year'], default: 'day' })
  period?: GraphPeriod

  @ApiPropertyOptional({ enum: ['gtk', 'park', 'stage', 'quarry', 'parkPercent', 'block'] })
  mode?: GraphMode

  @ApiPropertyOptional({ example: 'Олимпиада' })
  gtk_name?: string
}
