import { ApiProperty } from '@nestjs/swagger'

import { GraphPointDto } from './graph-point.dto'
import { type GraphPeriod } from './graph-query.dto'

export class GraphWithGtkMetadataDto {
  @ApiProperty()
  period!: GraphPeriod

  @ApiProperty()
  production_date!: string

  @ApiProperty()
  start_date!: string

  @ApiProperty()
  end_date!: string
}

export class GraphWithGtkDetailDto {
  @ApiProperty()
  indicator!: string

  @ApiProperty()
  gtk!: string

  @ApiProperty({ nullable: true, required: false })
  display_name?: string | null

  @ApiProperty()
  unit!: string

  @ApiProperty({ type: GraphPointDto, isArray: true })
  points!: GraphPointDto[]
}

export class GraphWithGtkResponseDto {
  @ApiProperty({ type: GraphWithGtkMetadataDto })
  metadata!: GraphWithGtkMetadataDto

  @ApiProperty({ type: GraphWithGtkDetailDto, isArray: true })
  details!: GraphWithGtkDetailDto[]
}
