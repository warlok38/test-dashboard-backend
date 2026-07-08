import { ApiProperty } from '@nestjs/swagger'

export class SummaryIndicatorDetailDto {
  @ApiProperty()
  gtk_or_zif!: string

  @ApiProperty({ nullable: true })
  plan_value!: number | null

  @ApiProperty({ nullable: true })
  fact_value!: number | null

  @ApiProperty({ nullable: true })
  deviation_pct!: number | null

  @ApiProperty()
  severity!: string
}

export class SummaryIndicatorCardDto {
  @ApiProperty()
  indicator_name!: string

  @ApiProperty({ nullable: true })
  plan_value!: number | null

  @ApiProperty({ nullable: true })
  fact_value!: number | null

  @ApiProperty({ nullable: true })
  deviation_pct!: number | null

  @ApiProperty()
  severity!: string

  @ApiProperty()
  measure_unit!: string

  @ApiProperty({ type: SummaryIndicatorDetailDto, isArray: true })
  details!: SummaryIndicatorDetailDto[]
}

export class StageSummaryDto {
  @ApiProperty()
  display_name!: string

  @ApiProperty()
  critical!: number

  @ApiProperty()
  warning!: number

  @ApiProperty()
  info!: number

  @ApiProperty({ type: SummaryIndicatorCardDto, isArray: true })
  cards!: SummaryIndicatorCardDto[]
}

export class AlarmSummaryResponseDto {
  @ApiProperty()
  production_date_from!: string

  @ApiProperty()
  production_date_to!: string

  @ApiProperty()
  shift!: number

  @ApiProperty()
  total_critical!: number

  @ApiProperty()
  total_warning!: number

  @ApiProperty()
  total_incidents!: number

  @ApiProperty({ type: Object })
  by_stage!: Record<string, StageSummaryDto>

  @ApiProperty({ type: StageSummaryDto })
  by_enrichment!: StageSummaryDto
}
