import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class MiningStagePointDto {
  @ApiProperty({ example: '10' })
  day!: string

  @ApiProperty({ example: 'Май' })
  month!: string

  @ApiProperty({ example: 296 })
  fact!: number

  @ApiProperty({ example: 323 })
  plan!: number
}

export class MiningStageSummaryDto {
  @ApiProperty({ example: 259 })
  fact!: number

  @ApiProperty({ example: 242 })
  plan!: number
}

export class MiningStageMetricDto {
  @ApiProperty({ example: 'rock-mass' })
  id!: string

  @ApiProperty({ example: 'Горная масса' })
  title!: string

  @ApiProperty({ example: 'тыс. м3' })
  unit!: string

  @ApiProperty({ enum: ['bar-line', 'line'], example: 'bar-line' })
  kind!: 'bar-line' | 'line'

  @ApiPropertyOptional({ example: '/production-stages/mining/rock-mass' })
  detailRoute?: string

  @ApiProperty({ type: MiningStageSummaryDto })
  summary!: MiningStageSummaryDto

  @ApiProperty({ type: MiningStagePointDto, isArray: true })
  data!: MiningStagePointDto[]
}