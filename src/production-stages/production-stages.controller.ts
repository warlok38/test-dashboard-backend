import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { AuthGuard } from '../auth/auth.guard'
import { ProductionMetricDetailDto } from './dto/metric-detail.dto'
import {
  CreateProductionMetricCommentDto,
  ProductionMetricCommentDto
} from './dto/metric-comment.dto'
import { DashboardStageDto } from './dto/production-stage.dto'
import { ProductionStagesQueryDto } from './dto/production-stages-query.dto'
import { MiningStageMetricDto } from './dto/stage-metric.dto'
import { ProductionStagesService } from './production-stages.service'

@ApiTags('production-stages')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('production-stages')
export class ProductionStagesController {
  constructor(private readonly productionStagesService: ProductionStagesService) {}

  @Get()
  @ApiOkResponse({ type: DashboardStageDto, isArray: true })
  findAll(@Query() query: ProductionStagesQueryDto): DashboardStageDto[] {
    return this.productionStagesService.findAll(query)
  }

  @Get(':stageSlug/metrics')
  @ApiOkResponse({ type: MiningStageMetricDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Production stage was not found' })
  findStageMetrics(
    @Param('stageSlug') stageSlug: string,
    @Query() query: ProductionStagesQueryDto
  ): MiningStageMetricDto[] {
    return this.productionStagesService.findStageMetrics(stageSlug, query)
  }

  @Post(':stageSlug/metrics/:metricSlug/comments')
  @ApiOkResponse({ type: ProductionMetricCommentDto })
  @ApiNotFoundResponse({ description: 'Production metric was not found' })
  createMetricComment(
    @Param('stageSlug') stageSlug: string,
    @Param('metricSlug') metricSlug: string,
    @Body() body: CreateProductionMetricCommentDto
  ): ProductionMetricCommentDto {
    return this.productionStagesService.createMetricComment(stageSlug, metricSlug, body)
  }

  @Get(':stageSlug/metrics/:metricSlug')
  @ApiOkResponse({ type: ProductionMetricDetailDto })
  @ApiNotFoundResponse({ description: 'Production metric was not found' })
  findMetricDetail(
    @Param('stageSlug') stageSlug: string,
    @Param('metricSlug') metricSlug: string,
    @Query() query: ProductionStagesQueryDto
  ): ProductionMetricDetailDto {
    return this.productionStagesService.findMetricDetail(stageSlug, metricSlug, query)
  }
}
