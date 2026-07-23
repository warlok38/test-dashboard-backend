import { Injectable } from '@nestjs/common'

import { generalSummaryMock, generalSummaryMocks } from './data/general-summary.data'
import { GRAPH_DATA_END_DATE, GRAPH_DATA_START_DATE, graphMock } from './data/graph.data'
import { summaryMock } from './data/summary.data'
import type { AlarmSummaryResponseDto } from './dto/alarm-summary-response.dto'
import type { GeneralSummaryQueryDto } from './dto/general-summary-query.dto'
import type { GeneralSummaryResponseDto } from './dto/general-summary-response.dto'
import type { GraphByModeQueryDto, GraphMode } from './dto/graph-by-mode-query.dto'
import type { GraphByModeDetailDto, GraphByModeResponseDto } from './dto/graph-by-mode-response.dto'
import type { GraphMappingResponseDto } from './dto/graph-mapping-response.dto'
import type { GraphPeriod, GraphQueryDto } from './dto/graph-query.dto'
import type { GraphPointDto } from './dto/graph-point.dto'
import type { GraphWithDetailsQueryDto } from './dto/graph-with-details-query.dto'
import type {
  GraphWithDetailsDetailDto,
  GraphWithDetailsResponseDto
} from './dto/graph-with-details-response.dto'
import type { GraphWithGtkQueryDto } from './dto/graph-with-gtk-query.dto'
import type {
  GraphWithGtkDetailDto,
  GraphWithGtkResponseDto
} from './dto/graph-with-gtk-response.dto'

const gtkNames = ['Олимпиада', 'Наталка', 'Благодатное', 'Куранах', 'Сухой Лог']
const DATE_REGEXP = /^\d{4}-\d{2}-\d{2}$/

type GraphIndicatorConfig = {
  factFactor: number
  factOffset: number
  measureUnit: string
  planFactor: number
  planOffset: number
}

const DEFAULT_GRAPH_INDICATOR = 'Горная масса'

type GtkGraphConfig = {
  base: number
  planOffset: number
  wave: number
}

type DetailsGraphConfig = {
  base: number
  indicator: string
  planOffset: number
  precision: number
  unit: string
  wave: number
}

type ModeGraphConfig = {
  base: number
  label: string
  planOffset: number
  wave: number
}

const GRAPH_WITH_GTK_DEFAULT_END_DATE = GRAPH_DATA_END_DATE
const SHIFT_DAY = 3
const SHIFT_MONTH = 99
const SHIFT_YEAR = 100
const DEFAULT_PRODUCTION_DATE = '2026-07-01'
const GTK_GRAPH_CONFIGS: Record<string, GtkGraphConfig> = {
  Олимпиада: { base: 695, planOffset: 18, wave: 34 },
  Благодатное: { base: 360, planOffset: -8, wave: 22 },
  Наталка: { base: 430, planOffset: 12, wave: 48 },
  Куранах: { base: 235, planOffset: 10, wave: 26 },
  'Сухой Лог': { base: 145, planOffset: -6, wave: 18 },
  КБЕ: { base: 0, planOffset: 0, wave: 0 }
}

const GRAPH_WITH_GTK_ORDER = ['Олимпиада', 'Благодатное', 'Наталка', 'Куранах', 'Сухой Лог', 'КБЕ']
const RELEASE_GRAPH_ZERO_FACT_DATES = new Set(['2026-07-05', '2026-07-10'])
const GRAPH_WITH_GTK_DISPLAY_NAMES: Record<string, string | null> = {
  Олимпиада: 'Олимпиада',
  Благодатное: 'Благодатное',
  Наталка: 'Наталка',
  Куранах: 'Куранах',
  'Сухой Лог': 'Сухой Лог',
  КБЕ: null
}
const GRAPH_WITH_DETAILS_CONFIGS: Record<string, DetailsGraphConfig[]> = {
  'Горная масса': [
    {
      indicator: 'Добыча руды',
      unit: 'тыс т',
      base: 360,
      planOffset: 18,
      precision: 2,
      wave: 140
    },
    {
      indicator: 'Содержание в руде',
      unit: 'т',
      base: 0.01,
      planOffset: 0.01,
      precision: 2,
      wave: 0.02
    },
    {
      indicator: 'Вскрыша',
      unit: 'тыс.м3',
      base: 1620,
      planOffset: -24,
      precision: 2,
      wave: 180
    }
  ],
  'Объем бурения': [
    {
      indicator: 'КИО Бурение',
      unit: '%',
      base: 62,
      planOffset: 4,
      precision: 1,
      wave: 18
    },
    {
      indicator: 'КТГ Бурение',
      unit: '%',
      base: 84,
      planOffset: -3,
      precision: 1,
      wave: 14
    },
    {
      indicator: 'Выход взорванной ГМ c 1 п.м.',
      unit: 'м3./п.м.',
      base: 32,
      planOffset: 2,
      precision: 2,
      wave: 12
    }
  ]
}
const GRAPH_MAPPING: GraphMappingResponseDto = {
  'Добыча руды': [
    {
      indicator: 'Добыча руды',
      unit: 'тыс т',
      modes: ['stage', 'gtk']
    },
    {
      indicator: 'Содержание в руде',
      unit: 'г/т',
      modes: ['gtk']
    }
  ],
  'Объем бурения': [
    {
      indicator: 'Объем бурения',
      unit: 'тыс.п.м.',
      modes: ['gtk', 'park', 'stage']
    },
    {
      indicator: 'КИО Бурение',
      unit: '%',
      modes: ['gtk', 'park', 'stage']
    },
    {
      indicator: 'КТГ Бурение',
      unit: '%',
      modes: ['gtk', 'park', 'stage']
    },
    {
      indicator: 'Выход взорванной ГМ c 1 п.м.',
      unit: 'м3./п.м.',
      modes: ['gtk']
    }
  ],
  'Горная масса': [
    {
      indicator: 'Горная масса',
      unit: 'тыс.м3',
      modes: ['gtk', 'stage']
    },
    {
      indicator: 'КИО Экскаваторы',
      unit: '%',
      modes: ['gtk', 'park', 'stage']
    },
    {
      indicator: 'КТГ Экскаваторы',
      unit: '%',
      modes: ['gtk', 'park', 'stage']
    },
    {
      indicator: 'Вскрыша',
      unit: 'тыс.м3',
      modes: ['gtk', 'stage']
    }
  ],
  Грузооборот: [
    {
      indicator: 'Грузооборот',
      unit: 'тыс.ткм',
      modes: ['gtk', 'stage', 'park']
    },
    {
      indicator: 'КИО Самосвалы',
      unit: '%',
      modes: ['gtk', 'park', 'stage']
    },
    {
      indicator: 'КТГ Самосвалы',
      unit: '%',
      modes: ['gtk', 'park', 'stage']
    },
    {
      indicator: 'Плечо',
      unit: 'км',
      modes: ['gtk', 'stage']
    }
  ],
  'Выпуск Au': [
    {
      indicator: 'Выпуск Au',
      unit: 'кг',
      modes: ['gtk']
    },
    {
      indicator: 'Переработка',
      unit: 'тыс т',
      modes: ['gtk']
    },
    {
      indicator: 'Содержание Au',
      unit: 'г/т',
      modes: ['gtk']
    },
    {
      indicator: 'Извлечение',
      unit: '%',
      modes: ['gtk']
    }
  ]
}
const GRAPH_INDICATOR_ALIASES: Record<string, string> = {
  Выпуск: 'Выпуск Au',
  'КИО бурового оборудования': 'КИО Бурение',
  'КТГ бурового оборудования': 'КТГ Бурение',
  'Выход взорванной ГМ с 1 п.м.': 'Выход взорванной ГМ c 1 п.м.',
  'Выход взорванной ГМ с 1 п.м': 'Выход взорванной ГМ c 1 п.м.',
  'КИО Самосвалов': 'КИО Самосвалы',
  'КТГ Самосвалов': 'КТГ Самосвалы'
}
const MODE_GRAPH_CONFIGS: Record<GraphMode, ModeGraphConfig[]> = {
  gtk: GRAPH_WITH_GTK_ORDER.map((gtk) => ({
    label: gtk,
    base: GTK_GRAPH_CONFIGS[gtk].base,
    planOffset: GTK_GRAPH_CONFIGS[gtk].planOffset,
    wave: GTK_GRAPH_CONFIGS[gtk].wave
  })),
  park: [
    { label: 'CAT 994K', base: 10, planOffset: -1.5, wave: 8 },
    { label: 'PC1250', base: 2.4, planOffset: 0.4, wave: 6 },
    { label: 'WK-20', base: 13.5, planOffset: 0.8, wave: 7 },
    { label: 'WK-35', base: 210, planOffset: 12, wave: 48 },
    { label: 'ЭКГ-20', base: 14, planOffset: 1.2, wave: 9 }
  ],
  stage: [
    { label: 'Бурение', base: 24, planOffset: 2, wave: 9 },
    { label: 'Добыча', base: 180, planOffset: 8, wave: 34 },
    { label: 'Транспортировка', base: 136, planOffset: -6, wave: 28 },
    { label: 'Переработка', base: 96, planOffset: 5, wave: 18 }
  ],
  quarry: [
    { label: 'Карьер Восточный', base: 68, planOffset: 4, wave: 18 },
    { label: 'Карьер Западный', base: 54, planOffset: -2, wave: 15 },
    { label: 'Карьер Центральный', base: 82, planOffset: 3, wave: 21 }
  ],
  parkPercent: [
    { label: 'Парк 90%+', base: 88, planOffset: 2, wave: 8 },
    { label: 'Парк 70-90%', base: 76, planOffset: 1, wave: 10 },
    { label: 'Парк до 70%', base: 62, planOffset: -1, wave: 12 }
  ],
  block: [
    { label: 'Блок 1', base: 44, planOffset: 3, wave: 12 },
    { label: 'Блок 2', base: 39, planOffset: -2, wave: 10 },
    { label: 'Блок 3', base: 51, planOffset: 1, wave: 14 },
    { label: 'Блок 4', base: 32, planOffset: 2, wave: 11 }
  ]
}
const GTK_DETAIL_FACTORS: Record<string, number> = {
  Олимпиада: 1,
  Благодатное: 0.82,
  Наталка: 1.12,
  Куранах: 0.68,
  'Сухой Лог': 0.46,
  Вернинское: 0.74
}
const GRAPH_INDICATOR_CONFIGS: Record<string, GraphIndicatorConfig> = {
  'Объем бурения': {
    factFactor: 0.32,
    factOffset: 8,
    measureUnit: 'тыс. п.м.',
    planFactor: 0.3,
    planOffset: 9
  },
  'Горная масса': {
    factFactor: 1,
    factOffset: 0,
    measureUnit: 'тыс. м3',
    planFactor: 1,
    planOffset: 0
  },
  Грузооборот: {
    factFactor: 14.8,
    factOffset: 420,
    measureUnit: 'тыс. ткм',
    planFactor: 14.2,
    planOffset: 450
  },
  'Выпуск Au': {
    factFactor: 0.18,
    factOffset: 3.5,
    measureUnit: 'кг',
    planFactor: 0.2,
    planOffset: 4
  },
  'Добыча руды': {
    factFactor: 0.24,
    factOffset: 2.5,
    measureUnit: 'тыс. т',
    planFactor: 0.23,
    planOffset: 3
  },
  'Содержание в руде': {
    factFactor: 0.006,
    factOffset: 0.25,
    measureUnit: 'г/т',
    planFactor: 0.007,
    planOffset: 0.3
  },
  Вскрыша: {
    factFactor: 0.82,
    factOffset: 12,
    measureUnit: 'тыс. м3',
    planFactor: 0.8,
    planOffset: 15
  },
  'КИО Бурение': {
    factFactor: 0.04,
    factOffset: 40,
    measureUnit: '%',
    planFactor: 0.04,
    planOffset: 43
  },
  'КТГ Бурение': {
    factFactor: 0.025,
    factOffset: 76,
    measureUnit: '%',
    planFactor: 0.024,
    planOffset: 78
  },
  'Выход взорванной ГМ c 1 п.м.': {
    factFactor: 0.025,
    factOffset: 15,
    measureUnit: 'м3./п.м.',
    planFactor: 0.024,
    planOffset: 17
  },
  'КИО Экскаваторы': {
    factFactor: 0.04,
    factOffset: 42,
    measureUnit: '%',
    planFactor: 0.04,
    planOffset: 44
  },
  'КТГ Экскаваторы': {
    factFactor: 0.025,
    factOffset: 78,
    measureUnit: '%',
    planFactor: 0.024,
    planOffset: 80
  },
  'КИО Самосвалы': {
    factFactor: 0.04,
    factOffset: 45,
    measureUnit: '%',
    planFactor: 0.04,
    planOffset: 46
  },
  'КТГ Самосвалы': {
    factFactor: 0.025,
    factOffset: 79,
    measureUnit: '%',
    planFactor: 0.024,
    planOffset: 80
  },
  Плечо: {
    factFactor: 0.016,
    factOffset: 6,
    measureUnit: 'км',
    planFactor: 0.015,
    planOffset: 6.2
  },
  Переработка: {
    factFactor: 0.28,
    factOffset: 4,
    measureUnit: 'тыс. т',
    planFactor: 0.26,
    planOffset: 4.5
  },
  'Содержание Au': {
    factFactor: 0.04,
    factOffset: 3.5,
    measureUnit: 'г/т',
    planFactor: 0.05,
    planOffset: 4
  },
  Извлечение: {
    factFactor: 1.8,
    factOffset: 280,
    measureUnit: '%',
    planFactor: 1.9,
    planOffset: 300
  }
}
function roundGraphValue(value: number): number {
  return Number(value.toFixed(2))
}

function getGraphIndicatorConfig(indicator: string | undefined): GraphIndicatorConfig {
  const normalizedIndicator = normalizeGraphIndicator(indicator)

  return (
    GRAPH_INDICATOR_CONFIGS[normalizedIndicator ?? DEFAULT_GRAPH_INDICATOR] ??
    GRAPH_INDICATOR_CONFIGS[DEFAULT_GRAPH_INDICATOR]
  )
}

function normalizeGraphIndicator(indicator: string | undefined): string | undefined {
  if (!indicator) {
    return indicator
  }

  return GRAPH_INDICATOR_ALIASES[indicator] ?? indicator
}

function getGraphWithGtkMeasureUnit(measureUnit: string): string {
  return measureUnit.replace('тыс. м3', 'тыс.м3').replace('тыс. т', 'тыс.т')
}

function getGraphFactValue(
  point: GraphPointDto,
  indicator: string | undefined,
  config: GraphIndicatorConfig
): number | null {
  if (point.fact === null) {
    return null
  }

  if (
    normalizeGraphIndicator(indicator) === 'Выпуск Au' &&
    RELEASE_GRAPH_ZERO_FACT_DATES.has(point.date)
  ) {
    return 0
  }

  return roundGraphValue(point.fact * config.factFactor + config.factOffset)
}

function mapGraphPointToIndicator(
  point: GraphPointDto,
  indicator: string | undefined,
  config: GraphIndicatorConfig
): GraphPointDto {
  return {
    date: point.date,
    fact: getGraphFactValue(point, indicator, config),
    measure_unit: config.measureUnit,
    plan:
      point.plan === null
        ? null
        : roundGraphValue(point.plan * config.planFactor + config.planOffset)
  }
}

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

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date)
  nextDate.setUTCDate(nextDate.getUTCDate() + days)

  return nextDate
}

function addMonths(date: Date, months: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1))
}

function addYears(date: Date, years: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear() + years, 0, 1))
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

function endOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0))
}

function endOfYear(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), 11, 31))
}

function getShiftPeriod(value: number | undefined): GraphPeriod | null {
  const shift = Number(value)

  if (shift === SHIFT_DAY) {
    return 'day'
  }

  if (shift === SHIFT_MONTH) {
    return 'month'
  }

  if (shift === SHIFT_YEAR) {
    return 'year'
  }

  return null
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

function getDefaultProductionDate(): Date {
  return parseDate(DEFAULT_PRODUCTION_DATE) ?? getToday()
}

function isGraphPeriod(value: string | undefined): value is GraphPeriod {
  return value === 'day' || value === 'month' || value === 'year'
}

function isPrevQuery(value: boolean | string | undefined): boolean {
  return value === true || value === 'true'
}

type PeriodQuery = {
  date?: string
  date_from?: string
  date_to?: string
  period?: GraphPeriod
  prev?: boolean | string
  production_date?: string
  shift?: number
}

function resolvePeriod(query: PeriodQuery): GraphPeriod {
  return getShiftPeriod(query.shift) ?? (isGraphPeriod(query.period) ? query.period : 'day')
}

function getProductionDate(query: PeriodQuery): Date {
  return parseDate(query.production_date) ?? getDefaultProductionDate()
}

function getPeriodRange(
  query: PeriodQuery,
  period: GraphPeriod
): { endDate: Date; productionDate: Date; startDate: Date } {
  const shiftPeriod = getShiftPeriod(query.shift)

  if (shiftPeriod) {
    const productionDate = getProductionDate(query)

    if (shiftPeriod === 'year') {
      const startDate = parseDate(GRAPH_DATA_START_DATE) ?? startOfYear(productionDate)
      const endDate = endOfYear(parseDate(GRAPH_DATA_END_DATE) ?? productionDate)

      return { startDate, endDate, productionDate }
    }

    if (shiftPeriod === 'month') {
      return {
        startDate: startOfYear(productionDate),
        endDate: endOfYear(productionDate),
        productionDate
      }
    }

    return {
      startDate: startOfMonth(productionDate),
      endDate: endOfMonth(productionDate),
      productionDate
    }
  }

  const singleDate = parseDate(query.date)
  const queryDateFrom = parseDate(query.date_from)
  const queryDateTo = parseDate(query.date_to)
  const fallbackDateTo = parseDate(GRAPH_WITH_GTK_DEFAULT_END_DATE) ?? getToday()

  if (singleDate) {
    return { startDate: singleDate, endDate: singleDate, productionDate: singleDate }
  }

  const endDate = queryDateTo ?? queryDateFrom ?? fallbackDateTo
  let startDate = queryDateFrom ?? getDefaultStartDate(period, fallbackDateTo)

  if (isPrevQuery(query.prev)) {
    if (period === 'year') {
      startDate = new Date(Date.UTC(endDate.getUTCFullYear() - 1, 0, 1))
    } else {
      startDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth() - 1, 1))
    }
  }

  return startDate > endDate
    ? { startDate: endDate, endDate, productionDate: endDate }
    : { startDate, endDate, productionDate: endDate }
}

function getGraphWithGtkPointDates(startDate: Date, endDate: Date, period: GraphPeriod): string[] {
  const dates: string[] = []
  const firstDate =
    period === 'month'
      ? startOfMonth(startDate)
      : period === 'year'
        ? startOfYear(startDate)
        : startDate

  for (
    let date = firstDate;
    date <= endDate;
    date =
      period === 'month'
        ? addMonths(date, 1)
        : period === 'year'
          ? addYears(date, 1)
          : addDays(date, 1)
  ) {
    dates.push(formatDate(date))
  }

  return dates
}

function isAfterDataEndDate(date: string): boolean {
  return date > GRAPH_DATA_END_DATE
}

function createEmptyGraphPoint(date: string, measureUnit: string): GraphPointDto {
  return {
    date,
    fact: null,
    measure_unit: measureUnit,
    plan: null
  }
}

function getGtkGraphPointValue(
  config: GtkGraphConfig,
  indicatorConfig: GraphIndicatorConfig,
  index: number,
  series: 'fact' | 'plan'
) {
  if (config.base === 0) {
    return null
  }

  const base = config.base + ((index * 17) % config.wave) - config.wave / 2
  const indicatorFactor =
    series === 'fact' ? indicatorConfig.factFactor : indicatorConfig.planFactor
  const indicatorOffset =
    series === 'fact' ? indicatorConfig.factOffset : indicatorConfig.planOffset
  const planAdjustment = series === 'plan' ? config.planOffset + ((index * 11) % 21) - 10 : 0

  return roundGraphValue(base * indicatorFactor + indicatorOffset + planAdjustment)
}

function createGraphWithGtkDetail(
  gtk: string,
  indicator: string,
  indicatorConfig: GraphIndicatorConfig,
  dates: string[]
): GraphWithGtkDetailDto {
  const gtkConfig = GTK_GRAPH_CONFIGS[gtk]
  const measureUnit = getGraphWithGtkMeasureUnit(indicatorConfig.measureUnit)

  return {
    indicator,
    gtk,
    display_name: GRAPH_WITH_GTK_DISPLAY_NAMES[gtk] ?? null,
    unit: measureUnit,
    points:
      gtkConfig.base === 0
        ? []
        : dates.map((date, index) =>
            isAfterDataEndDate(date)
              ? createEmptyGraphPoint(date, measureUnit)
              : {
                  date,
                  fact: getGtkGraphPointValue(gtkConfig, indicatorConfig, index, 'fact'),
                  plan: getGtkGraphPointValue(gtkConfig, indicatorConfig, index, 'plan'),
                  measure_unit: measureUnit
                }
          )
  }
}

function getGtkDetailsFactor(gtk: string | undefined): number {
  return gtk ? (GTK_DETAIL_FACTORS[gtk] ?? 1) : 1
}

function roundDetailGraphValue(value: number, precision: number): number {
  return Number(value.toFixed(precision))
}

function getDetailsGraphPointValue(
  config: DetailsGraphConfig,
  gtkFactor: number,
  index: number,
  series: 'fact' | 'plan'
) {
  const waveOffset = config.wave === 0 ? 0 : ((index * 23) % config.wave) - config.wave / 2
  const planAdjustment = series === 'plan' ? config.planOffset + ((index * 13) % 17) - 8 : 0
  const seriesAdjustment = series === 'fact' ? ((index * 7) % 11) - 5 : planAdjustment
  const value = (config.base + waveOffset + seriesAdjustment) * gtkFactor

  return roundDetailGraphValue(Math.max(value, 0), config.precision)
}

function createGraphWithDetailsDetail(
  config: DetailsGraphConfig,
  dates: string[],
  gtkFactor: number
): GraphWithDetailsDetailDto {
  return {
    indicator: config.indicator,
    unit: config.unit,
    points: dates.map((date, index) =>
      isAfterDataEndDate(date)
        ? createEmptyGraphPoint(date, config.unit)
        : {
            date,
            fact: getDetailsGraphPointValue(config, gtkFactor, index, 'fact'),
            plan: getDetailsGraphPointValue(config, gtkFactor, index, 'plan'),
            measure_unit: config.unit
          }
    )
  }
}

function getGraphMappingUnit(indicator: string): string | undefined {
  return Object.values(GRAPH_MAPPING)
    .flat()
    .find((item) => item.indicator === indicator)?.unit
}

function getModeGraphPointValue(
  config: ModeGraphConfig,
  indicatorConfig: GraphIndicatorConfig,
  gtkFactor: number,
  index: number,
  series: 'fact' | 'plan'
): number {
  const waveOffset = config.wave === 0 ? 0 : ((index * 19) % config.wave) - config.wave / 2
  const planAdjustment = series === 'plan' ? config.planOffset + ((index * 13) % 17) - 8 : 0
  const seriesAdjustment = series === 'fact' ? ((index * 7) % 11) - 5 : planAdjustment
  const indicatorFactor =
    series === 'fact' ? indicatorConfig.factFactor : indicatorConfig.planFactor
  const indicatorOffset =
    series === 'fact' ? indicatorConfig.factOffset : indicatorConfig.planOffset
  const value = (config.base + waveOffset + seriesAdjustment) * gtkFactor

  return roundGraphValue(Math.max(value * indicatorFactor + indicatorOffset, 0))
}

function createModeGraphDetail(
  config: ModeGraphConfig,
  indicator: string,
  indicatorConfig: GraphIndicatorConfig,
  dates: string[],
  unit: string,
  gtkFactor: number
): GraphByModeDetailDto {
  return {
    indicator,
    gtk: config.label,
    unit,
    points: dates.map((date, index) =>
      isAfterDataEndDate(date)
        ? createEmptyGraphPoint(date, unit)
        : {
            date,
            fact: getModeGraphPointValue(config, indicatorConfig, gtkFactor, index, 'fact'),
            plan: getModeGraphPointValue(config, indicatorConfig, gtkFactor, index, 'plan'),
            measure_unit: unit
          }
    )
  }
}

function getDateDiffInDays(dateFrom: Date, dateTo: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000

  return Math.floor((dateTo.getTime() - dateFrom.getTime()) / millisecondsPerDay)
}

function getGeneralSummaryMock(dateFromValue: string | undefined, dateToValue: string | undefined) {
  const dateFrom = parseDate(dateFromValue)
  const dateTo = parseDate(dateToValue)

  if (!dateFrom || !dateTo || dateFrom > dateTo) {
    return generalSummaryMock
  }

  const diffInDays = getDateDiffInDays(dateFrom, dateTo)

  if (diffInDays <= 1) {
    return generalSummaryMocks.day
  }

  if (diffInDays <= 14) {
    return generalSummaryMocks.week
  }

  if (diffInDays <= 90) {
    return generalSummaryMocks.month
  }

  return generalSummaryMocks.year
}

function getShift(value: number | undefined): number {
  if (value === undefined) {
    return generalSummaryMock.shift
  }

  const shift = Number(value)

  return Number.isFinite(shift) ? shift : generalSummaryMock.shift
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

function aggregateGraphPoints(
  points: GraphPointDto[],
  period: GraphPeriod
): Record<string, GraphPointDto> {
  return points.reduce<Record<string, GraphPointDto>>((groups, point) => {
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
}

function getCompleteGraphPoints(
  dates: string[],
  groupedPoints: Record<string, GraphPointDto>,
  measureUnit: string
): GraphPointDto[] {
  return dates.map((date) => groupedPoints[date] ?? createEmptyGraphPoint(date, measureUnit))
}

@Injectable()
export class ProductionSummaryService {
  findGtk(): string[] {
    return gtkNames
  }

  findSummary(): AlarmSummaryResponseDto {
    return summaryMock
  }

  findGeneralSummary(query: GeneralSummaryQueryDto = {}): GeneralSummaryResponseDto {
    const mock = getGeneralSummaryMock(query.date_from, query.date_to)
    const productionDate = query.production_date ?? mock.production_date_from

    return {
      ...mock,
      production_date: productionDate,
      production_date_from: query.date_from ?? mock.production_date_from,
      production_date_to: query.date_to ?? mock.production_date_to,
      shift: getShift(query.shift)
    }
  }

  findGraphMapping(): GraphMappingResponseDto {
    return GRAPH_MAPPING
  }

  findGraphByMode(query: GraphByModeQueryDto): GraphByModeResponseDto {
    const period = resolvePeriod(query)
    const { startDate, endDate } = getPeriodRange(query, period)
    const indicator = normalizeGraphIndicator(query.indicator) ?? DEFAULT_GRAPH_INDICATOR
    const indicatorConfig = getGraphIndicatorConfig(indicator)
    const unit =
      getGraphMappingUnit(indicator) ?? getGraphWithGtkMeasureUnit(indicatorConfig.measureUnit)
    const dates = getGraphWithGtkPointDates(startDate, endDate, period)
    const metadata = {
      period,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      shift: getShift(query.shift),
      gtk: query.gtk_name ?? ''
    }

    if (!query.mode) {
      const points = this.findGraph({
        indicator,
        shift: query.shift,
        production_date: query.production_date,
        period,
        date_from: query.date_from,
        date_to: query.date_to
      })

      return {
        metadata,
        details: [
          {
            indicator,
            gtk: '',
            unit,
            points: points.map((point) => ({
              ...point,
              measure_unit: unit
            }))
          }
        ]
      }
    }

    const gtkFactor = getGtkDetailsFactor(query.gtk_name)
    const modeConfigs = MODE_GRAPH_CONFIGS[query.mode] ?? []

    return {
      metadata,
      details: modeConfigs.map((modeConfig) =>
        createModeGraphDetail(modeConfig, indicator, indicatorConfig, dates, unit, gtkFactor)
      )
    }
  }

  findGraphWithGtk(query: GraphWithGtkQueryDto): GraphWithGtkResponseDto {
    const period = resolvePeriod(query)
    const { startDate, endDate, productionDate } = getPeriodRange(query, period)
    const indicator = normalizeGraphIndicator(query.indicator) ?? DEFAULT_GRAPH_INDICATOR
    const indicatorConfig = getGraphIndicatorConfig(indicator)
    const dates = getGraphWithGtkPointDates(startDate, endDate, period)

    return {
      metadata: {
        period,
        production_date: formatDate(productionDate),
        start_date: formatDate(startDate),
        end_date: formatDate(endDate)
      },
      details: GRAPH_WITH_GTK_ORDER.map((gtk) =>
        createGraphWithGtkDetail(gtk, indicator, indicatorConfig, dates)
      )
    }
  }

  findGraphWithDetails(query: GraphWithDetailsQueryDto): GraphWithDetailsResponseDto {
    const period = resolvePeriod(query)
    const { startDate, endDate, productionDate } = getPeriodRange(query, period)
    const dates = getGraphWithGtkPointDates(startDate, endDate, period)
    const indicator = normalizeGraphIndicator(query.indicator) ?? DEFAULT_GRAPH_INDICATOR
    const detailsConfig = GRAPH_WITH_DETAILS_CONFIGS[indicator] ?? []
    const gtkFactor = getGtkDetailsFactor(query.gtk)

    return {
      metadata: {
        period,
        production_date: formatDate(productionDate),
        start_date: formatDate(startDate),
        end_date: formatDate(endDate)
      },
      details: detailsConfig.map((detailConfig) =>
        createGraphWithDetailsDetail(detailConfig, dates, gtkFactor)
      )
    }
  }

  findGraph(query: GraphQueryDto = {}): GraphPointDto[] {
    const period = resolvePeriod(query)
    const { startDate, endDate } = getPeriodRange(query, period)

    if (startDate > endDate) {
      return []
    }

    const dateFrom = formatDate(startDate)
    const dateTo = formatDate(endDate)
    const indicatorConfig = getGraphIndicatorConfig(query.indicator)
    const filteredPoints = graphMock
      .filter((point) => point.date >= dateFrom && point.date <= dateTo)
      .map((point) => mapGraphPointToIndicator(point, query.indicator, indicatorConfig))
    const groupedPoints = aggregateGraphPoints(filteredPoints, period)
    const dates = getGraphWithGtkPointDates(startDate, endDate, period)

    return getCompleteGraphPoints(dates, groupedPoints, indicatorConfig.measureUnit)
  }
}
