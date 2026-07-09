import { Injectable } from '@nestjs/common'

import { GRAPH_DATA_START_DATE, graphMock } from './data/graph.data'
import { summaryMock } from './data/summary.data'
import type { AlarmSummaryResponseDto } from './dto/alarm-summary-response.dto'
import type { GraphPeriod, GraphQueryDto } from './dto/graph-query.dto'
import type { GraphPointDto } from './dto/graph-point.dto'

const gtkNames = ['Олимпиада', 'Наталка', 'Благодатное', 'Куранах', 'Сухой Лог']
const DATE_REGEXP = /^\d{4}-\d{2}-\d{2}$/

function parseDate(value: string | undefined): Date | null {
  if (!value || !DATE_REGEXP.test(value)) {
    return null
  }

  const date = new Date(`${value}T00:00:00.000Z`)

  return Number.isNaN(date.getTime()) ? null : date
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function getToday(): Date {
  const today = new Date()

  return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
}

function startOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}

function startOfYear(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
}

function getDefaultStartDate(period: GraphPeriod, endDate: Date): Date {
  if (period === 'month') {
    return startOfYear(endDate)
  }

  if (period === 'year') {
    return parseDate(GRAPH_DATA_START_DATE) ?? startOfYear(endDate)
  }

  return startOfMonth(endDate)
}

function isGraphPeriod(value: string | undefined): value is GraphPeriod {
  return value === 'day' || value === 'month' || value === 'year'
}

function getBucketDate(date: Date, period: GraphPeriod): string {
  if (period === 'month') {
    return formatDate(startOfMonth(date))
  }

  if (period === 'year') {
    return formatDate(startOfYear(date))
  }

  return formatDate(date)
}

@Injectable()
export class ProductionSummaryService {
  findGtk(): string[] {
    return gtkNames
  }

  findSummary(): AlarmSummaryResponseDto {
    return summaryMock
  }

  findGraph(query: GraphQueryDto = {}): GraphPointDto[] {
    const period = isGraphPeriod(query.period) ? query.period : 'day'
    const queryDateFrom = parseDate(query.date_from)
    const queryDateTo = parseDate(query.date_to)
    const endDate = queryDateTo ?? queryDateFrom ?? getToday()
    const startDate = queryDateFrom ?? getDefaultStartDate(period, endDate)

    if (startDate > endDate) {
      return []
    }

    const dateFrom = formatDate(startDate)
    const dateTo = formatDate(endDate)
    const filteredPoints = graphMock.filter(
      (point) => point.date >= dateFrom && point.date <= dateTo
    )

    if (period === 'day') {
      return filteredPoints
    }

    const groupedPoints = filteredPoints.reduce<Record<string, GraphPointDto>>((groups, point) => {
      const date = parseDate(point.date)

      if (!date) {
        return groups
      }

      const bucketDate = getBucketDate(date, period)
      const bucket = groups[bucketDate] ?? {
        date: bucketDate,
        fact: 0,
        measure_unit: point.measure_unit,
        plan: 0
      }

      bucket.fact = (bucket.fact ?? 0) + (point.fact ?? 0)
      bucket.plan = (bucket.plan ?? 0) + (point.plan ?? 0)
      bucket.measure_unit = point.measure_unit
      groups[bucketDate] = bucket

      return groups
    }, {})

    return Object.values(groupedPoints)
  }
}
