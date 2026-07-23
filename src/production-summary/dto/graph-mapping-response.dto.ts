import { ApiProperty } from '@nestjs/swagger'

export class GraphMappingItemDto {
  @ApiProperty()
  indicator!: string

  @ApiProperty()
  unit!: string

  @ApiProperty({ type: String, isArray: true })
  modes!: string[]
}

export type GraphMappingResponseDto = Record<string, GraphMappingItemDto[]>
