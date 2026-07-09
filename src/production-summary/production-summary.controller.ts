import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { AuthGuard } from '../auth/auth.guard'
import { AlarmSummaryResponseDto } from './dto/alarm-summary-response.dto'
import { GraphQueryDto } from './dto/graph-query.dto'
import { GraphPointDto } from './dto/graph-point.dto'
import { ProductionSummaryService } from './production-summary.service'

@ApiTags('production-summary')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class ProductionSummaryController {
  constructor(private readonly productionSummaryService: ProductionSummaryService) {}

  @Get('gtk')
  @ApiOkResponse({ type: String, isArray: true })
  findGtk(): string[] {
    return this.productionSummaryService.findGtk()
  }

  @Get('summary')
  @ApiOkResponse({ type: AlarmSummaryResponseDto })
  findSummary(): AlarmSummaryResponseDto {
    return this.productionSummaryService.findSummary()
  }

  @Get('graph')
  @ApiOkResponse({ type: GraphPointDto, isArray: true })
  findGraph(@Query() query: GraphQueryDto): GraphPointDto[] {
    return this.productionSummaryService.findGraph(query)
  }
}
