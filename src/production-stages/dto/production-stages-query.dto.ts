import { ApiPropertyOptional } from '@nestjs/swagger'

export class ProductionStagesQueryDto {
  @ApiPropertyOptional({ example: '2026-06-01' })
  dateFrom?: string

  @ApiPropertyOptional({ example: '2026-06-23' })
  dateTo?: string

  @ApiPropertyOptional({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: ['olimpiada', 'natalka']
  })
  businessUnit?: string | string[]
}