import { ApiPropertyOptional } from '@nestjs/swagger'

export class GeneralSummaryQueryDto {
  @ApiPropertyOptional({ example: '2026-06-26' })
  date_from?: string

  @ApiPropertyOptional({ example: '2026-06-26' })
  date_to?: string

  @ApiPropertyOptional({ example: 3 })
  shift?: number

  @ApiPropertyOptional({ example: '2026-07-01' })
  production_date?: string

  @ApiPropertyOptional({ example: 'Олимпиада' })
  gtk?: string
}
