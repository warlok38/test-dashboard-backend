import { ApiProperty } from '@nestjs/swagger'

import { GraphPointDto } from './graph-point.dto'
import { type GraphPeriod } from './graph-query.dto'

export class GraphByModeMetadataDto {
  @ApiProperty()
  period!: GraphPeriod

  @ApiProperty()
  start_date!: string

  @ApiProperty()
  end_date!: string

  @ApiProperty()
  shift!: number

  @ApiProperty()
  gtk!: string
}

export class GraphByModeDetailDto {
  @ApiProperty()
  indicator!: string

  @ApiProperty()
  gtk!: string

  @ApiProperty()
  unit!: string

  @ApiProperty({ type: GraphPointDto, isArray: true })
  points!: GraphPointDto[]
}

export class GraphByModeResponseDto {
  @ApiProperty({ type: GraphByModeMetadataDto })
  metadata!: GraphByModeMetadataDto

  @ApiProperty({ type: GraphByModeDetailDto, isArray: true })
  details!: GraphByModeDetailDto[]
}
