import { ApiProperty } from '@nestjs/swagger'

export class GeneralSummaryCardDto {
  @ApiProperty()
  indicator_name!: string

  @ApiProperty()
  plan_value!: number

  @ApiProperty()
  fact_value!: number

  @ApiProperty()
  deviation_pct!: number

  @ApiProperty()
  measure_unit!: string

  @ApiProperty({ type: () => GeneralSummaryCardDto, isArray: true, nullable: true })
  cards!: GeneralSummaryCardDto[] | null
}

export class GeneralSummaryResponseDto {
  @ApiProperty()
  production_date_from!: string

  @ApiProperty()
  production_date_to!: string

  @ApiProperty()
  shift!: number

  @ApiProperty({ type: GeneralSummaryCardDto, isArray: true })
  cards!: GeneralSummaryCardDto[]
}
