import { ApiProperty } from '@nestjs/swagger'

import { GraphPointDto } from './graph-point.dto'
import { type GraphPeriod } from './graph-query.dto'

export class GraphWithDetailsMetadataDto {
  @ApiProperty()
  period!: GraphPeriod

  @ApiProperty()
  start_date!: string

  @ApiProperty()
  end_date!: string
}

export class GraphWithDetailsDetailDto {
  @ApiProperty()
  indicator!: string

  @ApiProperty()
  unit!: string

  @ApiProperty({ type: GraphPointDto, isArray: true })
  points!: GraphPointDto[]
}

export class GraphWithDetailsResponseDto {
  @ApiProperty({ type: GraphWithDetailsMetadataDto })
  metadata!: GraphWithDetailsMetadataDto

  @ApiProperty({ type: GraphWithDetailsDetailDto, isArray: true })
  details!: GraphWithDetailsDetailDto[]
}
