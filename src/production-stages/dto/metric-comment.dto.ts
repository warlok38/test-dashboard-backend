import { ApiProperty } from '@nestjs/swagger'

export class CreateProductionMetricCommentDto {
  @ApiProperty({ example: 'Оператор' })
  author!: string

  @ApiProperty({ example: 'Причина отклонения: простой техники на участке.' })
  text!: string
}

export class ProductionMetricCommentDto {
  @ApiProperty({ example: 'comment-1' })
  id!: string

  @ApiProperty({ example: 'mining' })
  stageSlug!: string

  @ApiProperty({ example: 'rock-mass' })
  metricSlug!: string

  @ApiProperty({ example: 'Оператор' })
  author!: string

  @ApiProperty({ example: 'Причина отклонения: простой техники на участке.' })
  text!: string

  @ApiProperty({ example: '2026-06-23T09:30:00.000Z' })
  createdAt!: string
}
