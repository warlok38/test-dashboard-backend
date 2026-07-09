import { ApiProperty } from '@nestjs/swagger'

export class GraphPointDto {
  @ApiProperty()
  date!: string

  @ApiProperty({ nullable: true })
  fact!: number | null

  @ApiProperty({ nullable: true })
  plan!: number | null

  @ApiProperty()
  measure_unit!: string
}
