import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { AuthGuard } from '../auth/auth.guard'
import { AlarmSummaryResponseDto } from './dto/alarm-summary-response.dto'
import { GeneralSummaryQueryDto } from './dto/general-summary-query.dto'
import { GeneralSummaryResponseDto } from './dto/general-summary-response.dto'
import { GraphByModeQueryDto } from './dto/graph-by-mode-query.dto'
import { GraphByModeResponseDto } from './dto/graph-by-mode-response.dto'
import { type GraphMappingResponseDto } from './dto/graph-mapping-response.dto'
import { GraphQueryDto } from './dto/graph-query.dto'
import { GraphWithDetailsQueryDto } from './dto/graph-with-details-query.dto'
import { GraphWithDetailsResponseDto } from './dto/graph-with-details-response.dto'
import { GraphWithGtkQueryDto } from './dto/graph-with-gtk-query.dto'
import { GraphWithGtkResponseDto } from './dto/graph-with-gtk-response.dto'
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

  @Get('general/info')
  @ApiOkResponse({ type: GeneralSummaryResponseDto })
  findGeneralSummary(@Query() query: GeneralSummaryQueryDto): GeneralSummaryResponseDto {
    return this.productionSummaryService.findGeneralSummary(query)
  }

  @Get('productivity/graph-mapping')
  @ApiOkResponse({ description: 'Graph tabs and available detail modes by indicator' })
  findGraphMapping(): GraphMappingResponseDto {
    return this.productionSummaryService.findGraphMapping()
  }

  @Get('productivity/graph-by-mode')
  @ApiOkResponse({ type: GraphByModeResponseDto })
  findGraphByMode(@Query() query: GraphByModeQueryDto): GraphByModeResponseDto {
    return this.productionSummaryService.findGraphByMode(query)
  }

  @Get('productivity/graph-with-gtk')
  @ApiOkResponse({ type: GraphWithGtkResponseDto })
  findGraphWithGtk(@Query() query: GraphWithGtkQueryDto): GraphWithGtkResponseDto {
    return this.productionSummaryService.findGraphWithGtk(query)
  }

  @Get('productivity/graph-with-details')
  @ApiOkResponse({ type: GraphWithDetailsResponseDto })
  findGraphWithDetails(@Query() query: GraphWithDetailsQueryDto): GraphWithDetailsResponseDto {
    return this.productionSummaryService.findGraphWithDetails(query)
  }

  @Get('graph')
  @ApiOkResponse({ type: GraphPointDto, isArray: true })
  findGraph(@Query() query: GraphQueryDto): GraphPointDto[] {
    return this.productionSummaryService.findGraph(query)
  }
}
