import { Injectable, NotFoundException } from '@nestjs/common'

import {
  businessUnits,
  isBusinessUnitValue,
  type BusinessUnitValue
} from '../business-units/data/business-units.data'
import { industrialDashboardStages } from './data/industrial-dashboard.data'
import { miningStageMetrics } from './data/mining-stage-overview.data'
import { productionMetricDetails } from './data/production-stage-details.data'
import { DashboardStageDto } from './dto/production-stage.dto'
import { MiningStageMetricDto } from './dto/stage-metric.dto'
import { ProductionMetricDetailDto } from './dto/metric-detail.dto'
import {
  CreateProductionMetricCommentDto,
  ProductionMetricCommentDto
} from './dto/metric-comment.dto'
import { ProductionStagesQueryDto } from './dto/production-stages-query.dto'

type AggregationKind = 'sum' | 'average'

const BUSINESS_UNIT_WEIGHTS: Record<BusinessUnitValue, number> = {
  olimpiada: 0.42,
  blagodatnoe: 0.18,
  natalka: 0.24,
  kuranah: 0.08,
  'suhoy-log': 0.08
}

const AVERAGE_METRIC_IDS = new Set([
  'au-content',
  'drilling-kio',
  'drilling-ktg',
  'excavation-kio',
  'excavation-ktg',
  'mining-au-content',
  'processing-au-content',
  'transport-kio',
  'transport-ktg'
])

function roundMetricValue(value: number | null, fractionDigits = 2): number | null {
  if (value === null) {
    return null
  }

  return Number(value.toFixed(fractionDigits))
}

function getDelta(value: number | null, plan: number | null): number | null {
  if (value === null || plan === null || plan === 0) {
    return null
  }

  return roundMetricValue(((value - plan) / plan) * 100, 1)
}

function getStatus(value: number | null, delta: number | null) {
  if (value === null || delta === null) {
    return 'danger'
  }

  if (delta < 0) {
    return 'danger'
  }

  return 'success'
}

function normalizeBusinessUnits(query?: ProductionStagesQueryDto): BusinessUnitValue[] {
  const businessUnit = query?.businessUnit
  const values = Array.isArray(businessUnit) ? businessUnit : businessUnit ? [businessUnit] : []
  const selectedUnits = values.filter(isBusinessUnitValue)

  return selectedUnits.length > 0 ? selectedUnits : businessUnits.map((unit) => unit.value)
}

function getAggregationKind(metricId: string): AggregationKind {
  return AVERAGE_METRIC_IDS.has(metricId) ? 'average' : 'sum'
}

function getMetricSlugFromDetailRoute(detailRoute?: string): string | null {
  if (!detailRoute) {
    return null
  }

  return detailRoute.split('/').at(-1) ?? null
}

function aggregateBaseValue(
  value: number | null,
  selectedUnits: BusinessUnitValue[],
  metricId: string
): number | null {
  if (value === null) {
    return null
  }

  const aggregationKind = getAggregationKind(metricId)

  if (aggregationKind === 'average') {
    return roundMetricValue(value)
  }

  const selectedWeight = selectedUnits.reduce((sum, unit) => sum + BUSINESS_UNIT_WEIGHTS[unit], 0)

  return roundMetricValue(value * selectedWeight)
}

@Injectable()
export class ProductionStagesService {
  private readonly metricComments: ProductionMetricCommentDto[] = []

  findAll(query?: ProductionStagesQueryDto): DashboardStageDto[] {
    const selectedUnits = normalizeBusinessUnits(query)

    return industrialDashboardStages.map((stage) => ({
      ...stage,
      metrics: stage.metrics.map((metric) => {
        const metricSlug = getMetricSlugFromDetailRoute(metric.detailRoute)
        const detailSummary = metricSlug
          ? this.aggregateMetricSummary(stage.id, metricSlug, selectedUnits, {
              fact: metric.value ?? 0,
              plan: metric.plan ?? 0
            })
          : null
        const value = detailSummary
          ? detailSummary.fact
          : aggregateBaseValue(metric.value, selectedUnits, metric.id)
        const plan = detailSummary
          ? detailSummary.plan
          : aggregateBaseValue(metric.plan, selectedUnits, metric.id)
        const delta = getDelta(value, plan)

        return {
          ...metric,
          value,
          plan,
          delta,
          status: getStatus(value, delta)
        }
      })
    }))
  }

  findStageMetrics(stageSlug: string, query?: ProductionStagesQueryDto): MiningStageMetricDto[] {
    if (stageSlug !== 'mining') {
      throw new NotFoundException(`Production stage '${stageSlug}' was not found`)
    }

    const selectedUnits = normalizeBusinessUnits(query)

    return miningStageMetrics.map((metric) => {
      const summary = this.aggregateMetricSummary(
        stageSlug,
        metric.id,
        selectedUnits,
        metric.summary
      )

      return {
        ...metric,
        summary,
        data: this.aggregateMetricTrend(stageSlug, metric.id, selectedUnits, metric.data)
      }
    })
  }

  findMetricDetail(
    stageSlug: string,
    metricSlug: string,
    query?: ProductionStagesQueryDto
  ): ProductionMetricDetailDto {
    const detail = productionMetricDetails.find(
      (metricDetail) =>
        metricDetail.stageSlug === stageSlug && metricDetail.metricSlug === metricSlug
    )

    if (!detail) {
      throw new NotFoundException(`Production metric '${stageSlug}/${metricSlug}' was not found`)
    }

    const selectedUnits = normalizeBusinessUnits(query)

    return {
      ...detail,
      summaries: detail.summaries.filter((summary) => selectedUnits.includes(summary.slug)),
      trend: this.aggregateMetricTrend(stageSlug, metricSlug, selectedUnits, detail.trend)
    }
  }

  createMetricComment(
    stageSlug: string,
    metricSlug: string,
    comment: CreateProductionMetricCommentDto
  ): ProductionMetricCommentDto {
    this.findMetricDetail(stageSlug, metricSlug)

    const createdComment: ProductionMetricCommentDto = {
      id: `comment-${this.metricComments.length + 1}`,
      stageSlug,
      metricSlug,
      author: comment.author,
      text: comment.text,
      createdAt: new Date().toISOString()
    }

    this.metricComments.push(createdComment)

    return createdComment
  }

  private aggregateMetricSummary(
    stageSlug: string,
    metricSlug: string,
    selectedUnits: BusinessUnitValue[],
    fallbackSummary: MiningStageMetricDto['summary']
  ): MiningStageMetricDto['summary'] {
    const detail = this.findMetricDetailSource(stageSlug, metricSlug)

    if (!detail) {
      return {
        fact: aggregateBaseValue(fallbackSummary.fact, selectedUnits, metricSlug) ?? 0,
        plan: aggregateBaseValue(fallbackSummary.plan, selectedUnits, metricSlug) ?? 0
      }
    }

    return detail.summaries
      .filter((summary) => selectedUnits.includes(summary.slug))
      .reduce(
        (summary, unit) => ({
          fact: roundMetricValue(summary.fact + (unit.fact ?? 0)) ?? 0,
          plan: roundMetricValue(summary.plan + unit.plan) ?? 0
        }),
        { fact: 0, plan: 0 }
      )
  }

  private aggregateMetricTrend(
    stageSlug: string,
    metricSlug: string,
    selectedUnits: BusinessUnitValue[],
    trend: ProductionMetricDetailDto['trend']
  ): ProductionMetricDetailDto['trend'] {
    const detail = this.findMetricDetailSource(stageSlug, metricSlug)

    if (!detail) {
      return trend.map((point) => ({
        ...point,
        fact: aggregateBaseValue(point.fact, selectedUnits, metricSlug) ?? 0,
        plan: aggregateBaseValue(point.plan, selectedUnits, metricSlug) ?? 0
      }))
    }

    const selectedSummaries = detail.summaries.filter((summary) =>
      selectedUnits.includes(summary.slug)
    )
    const selectedFact = selectedSummaries.reduce((sum, summary) => sum + (summary.fact ?? 0), 0)
    const selectedPlan = selectedSummaries.reduce((sum, summary) => sum + summary.plan, 0)
    const totalFact = detail.summaries.reduce((sum, summary) => sum + (summary.fact ?? 0), 0)
    const totalPlan = detail.summaries.reduce((sum, summary) => sum + summary.plan, 0)
    const factRatio = totalFact === 0 ? 0 : selectedFact / totalFact
    const planRatio = totalPlan === 0 ? 0 : selectedPlan / totalPlan

    return trend.map((point) => ({
      ...point,
      fact: roundMetricValue(point.fact * factRatio) ?? 0,
      plan: roundMetricValue(point.plan * planRatio) ?? 0
    }))
  }

  private findMetricDetailSource(stageSlug: string, metricSlug: string) {
    return productionMetricDetails.find(
      (metricDetail) =>
        metricDetail.stageSlug === stageSlug && metricDetail.metricSlug === metricSlug
    )
  }
}
