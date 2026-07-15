import { ProductionSummaryService } from './production-summary.service'

type GeneralSummaryGtkBreakdown = {
  gtk_or_zif: string
  fact_value: number
  plan_value: number
  deviation_pct: number
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

describe('ProductionSummaryService', () => {
  let service: ProductionSummaryService

  beforeEach(() => {
    service = new ProductionSummaryService()
  })

  it('returns gtk names', () => {
    expect(service.findGtk()).toEqual([
      'Олимпиада',
      'Наталка',
      'Благодатное',
      'Куранах',
      'Сухой Лог'
    ])
  })

  it('returns alarm summary', () => {
    const summary = service.findSummary()

    expect(summary.total_incidents).toBe(3)
    expect(summary.by_stage.mining.display_name).toBe('Добыча')
    expect(summary.by_stage.mining.cards[0].details[0].display_name).toBe('Олимпиада')
    expect(summary.by_enrichment.display_name).toBe('Обогащение')
  })

  it('returns general summary cards from the production overview mock', () => {
    const summary = service.findGeneralSummary({
      date_from: '2026-06-26',
      date_to: '2026-06-26',
      shift: 3,
      gtk: 'Олимпиада'
    })

    expect(summary).toMatchObject({
      production_date_from: '2026-06-26',
      production_date_to: '2026-06-26',
      shift: 3
    })
    expect(summary.cards[0]).toEqual(
      expect.objectContaining({
        indicator_name: 'Количество AU',
        measure_unit: 'кг',
        plan_value: expect.any(Number),
        fact_value: expect.any(Number),
        deviation_pct: expect.any(Number)
      })
    )
    expect(summary.cards[0].cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ indicator_name: 'Объем бурения', measure_unit: 'тыс. п.м.' }),
        expect.objectContaining({ indicator_name: 'Горная масса', measure_unit: 'тыс. м3' }),
        expect.objectContaining({ indicator_name: 'Грузооборот', measure_unit: 'тыс. ткм' }),
        expect.objectContaining({ indicator_name: 'Выпуск', measure_unit: 'кг' })
      ])
    )
    expect(summary.cards[0].cards?.flatMap((card) => card.cards ?? [])).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ indicator_name: 'Добыча руды', measure_unit: 'тыс. т' }),
        expect.objectContaining({ indicator_name: 'Извлечение', measure_unit: '%' })
      ])
    )
  })
  it('returns different general summary values for different date ranges', () => {
    const daySummary = service.findGeneralSummary({
      date_from: '2026-07-10',
      date_to: '2026-07-10'
    })
    const monthSummary = service.findGeneralSummary({
      date_from: '2026-07-01',
      date_to: '2026-07-10'
    })
    const yearSummary = service.findGeneralSummary({
      date_from: '2026-01-01',
      date_to: '2026-07-10'
    })

    expect(daySummary.cards[0].fact_value).not.toBe(monthSummary.cards[0].fact_value)
    expect(monthSummary.cards[0].fact_value).not.toBe(yearSummary.cards[0].fact_value)
    expect(daySummary.cards[0].cards?.[0].fact_value).not.toBe(
      monthSummary.cards[0].cards?.[0].fact_value
    )
  })

  it('returns gtk breakdown only for drillable general summary cards', () => {
    const daySummary = service.findGeneralSummary({
      date_from: '2026-07-10',
      date_to: '2026-07-10'
    })
    const weekSummary = service.findGeneralSummary({
      date_from: '2026-07-01',
      date_to: '2026-07-10'
    })
    const dayCards = daySummary.cards[0].cards ?? []
    const weekCards = weekSummary.cards[0].cards ?? []
    const drillingCard = dayCards.find((card) => card.indicator_name === 'Объем бурения') as
      | ((typeof dayCards)[number] & { details?: GeneralSummaryGtkBreakdown[] | null })
      | undefined
    const miningMassCard = dayCards.find((card) => card.indicator_name === 'Горная масса') as
      | ((typeof dayCards)[number] & { details?: GeneralSummaryGtkBreakdown[] | null })
      | undefined
    const turnoverCard = dayCards.find((card) => card.indicator_name === 'Грузооборот') as
      | ((typeof dayCards)[number] & { details?: GeneralSummaryGtkBreakdown[] | null })
      | undefined
    const weekDrillingCard = weekCards.find((card) => card.indicator_name === 'Объем бурения') as
      | ((typeof weekCards)[number] & { details?: GeneralSummaryGtkBreakdown[] | null })
      | undefined

    expect(drillingCard?.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gtk_or_zif: 'Олимпиада',
          fact_value: expect.any(Number),
          plan_value: expect.any(Number),
          deviation_pct: expect.any(Number)
        })
      ])
    )
    expect(miningMassCard?.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ gtk_or_zif: 'Наталка' }),
        expect.objectContaining({ gtk_or_zif: 'Сухой Лог' })
      ])
    )
    expect(turnoverCard?.details).toBeNull()
    expect(weekDrillingCard?.details?.[0].fact_value).not.toBe(
      drillingCard?.details?.[0].fact_value
    )
    expect(weekDrillingCard?.details?.[0].plan_value).not.toBe(
      drillingCard?.details?.[0].plan_value
    )
    expect(weekDrillingCard?.details?.[0].deviation_pct).not.toBe(
      drillingCard?.details?.[0].deviation_pct
    )
  })

  it('normalizes general summary shift query value', () => {
    const summary = service.findGeneralSummary({
      shift: '2' as unknown as number
    })

    expect(summary.shift).toBe(2)
  })

  it('returns graph points', () => {
    const points = service.findGraph({
      period: 'day',
      date_from: '2024-01-01',
      date_to: '2024-01-03'
    })

    expect(points).toEqual([
      { date: '2024-01-01', fact: 89, measure_unit: 'тыс. м3', plan: 92 },
      { date: '2024-01-02', fact: 96, measure_unit: 'тыс. м3', plan: 98 },
      { date: '2024-01-03', fact: 103, measure_unit: 'тыс. м3', plan: 104 }
    ])
  })

  it('returns different graph points for different indicators', () => {
    const miningMassPoints = service.findGraph({
      indicator: 'Горная масса',
      period: 'day',
      date_from: '2024-01-01',
      date_to: '2024-01-03'
    })
    const oreMiningPoints = service.findGraph({
      indicator: 'Добыча руды',
      period: 'day',
      date_from: '2024-01-01',
      date_to: '2024-01-03'
    })

    expect(miningMassPoints).not.toEqual(oreMiningPoints)
    expect(miningMassPoints[0].measure_unit).toBe('тыс. м3')
    expect(oreMiningPoints[0].measure_unit).toBe('тыс. т')
    expect(miningMassPoints[0].fact).not.toBe(oreMiningPoints[0].fact)
  })

  it('returns graph with gtk details for the selected indicator and range', () => {
    const response = service.findGraphWithGtk({
      indicator: 'Горная масса',
      period: 'day',
      date_from: '2026-07-01',
      date_to: '2026-07-13'
    })

    expect(response.metadata).toEqual({
      period: 'day',
      production_date: '2026-07-13',
      start_date: '2026-07-01',
      end_date: '2026-07-13'
    })
    expect(response.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          indicator: 'Горная масса',
          display_name: 'Олимпиада',
          gtk: 'Олимпиада',
          unit: 'тыс.м3'
        }),
        expect.objectContaining({ indicator: 'Горная масса', gtk: 'Сухой Лог', unit: 'тыс.м3' }),
        expect.objectContaining({ indicator: 'Горная масса', gtk: 'КБЕ', unit: 'тыс.м3' })
      ])
    )
    expect(response.details[0].points[0]).toEqual(
      expect.objectContaining({
        date: '2026-07-01',
        fact: expect.any(Number),
        plan: expect.any(Number),
        measure_unit: 'тыс.м3'
      })
    )
    expect(response.details[0].points.at(-1)?.date).toBe('2026-07-13')
  })

  it('returns monthly graph with gtk points when period is month', () => {
    const response = service.findGraphWithGtk({
      indicator: 'Добыча руды',
      period: 'month',
      date_from: '2026-01-01',
      date_to: '2026-07-13'
    })

    expect(response.metadata.period).toBe('month')
    expect(response.details[0].unit).toBe('тыс.т')
    expect(response.details[0].points.map((point) => point.date)).toEqual([
      '2026-01-01',
      '2026-02-01',
      '2026-03-01',
      '2026-04-01',
      '2026-05-01',
      '2026-06-01',
      '2026-07-01'
    ])
  })

  it('returns a full July 2026 daily graph with empty future points for shift day', () => {
    const points = service.findGraph({
      indicator: 'Горная масса',
      shift: 3,
      production_date: '2026-07-01'
    })

    expect(points).toHaveLength(31)
    expect(points[0]).toEqual(
      expect.objectContaining({
        date: '2026-07-01',
        fact: expect.any(Number),
        plan: expect.any(Number)
      })
    )
    expect(points[13]).toEqual(
      expect.objectContaining({
        date: '2026-07-14',
        fact: expect.any(Number),
        plan: expect.any(Number)
      })
    )
    expect(points[14]).toEqual({
      date: '2026-07-15',
      fact: null,
      measure_unit: 'тыс. м3',
      plan: null
    })
    expect(points.at(-1)).toEqual({
      date: '2026-07-31',
      fact: null,
      measure_unit: 'тыс. м3',
      plan: null
    })
  })

  it('returns a full 2026 monthly graph for shift month', () => {
    const points = service.findGraph({
      indicator: 'Горная масса',
      shift: 99,
      production_date: '2026-01-01'
    })

    expect(points.map((point) => point.date)).toEqual([
      '2026-01-01',
      '2026-02-01',
      '2026-03-01',
      '2026-04-01',
      '2026-05-01',
      '2026-06-01',
      '2026-07-01',
      '2026-08-01',
      '2026-09-01',
      '2026-10-01',
      '2026-11-01',
      '2026-12-01'
    ])
  })

  it('returns graph with gtk points for drilling detail indicators', () => {
    const response = service.findGraphWithGtk({
      indicator: 'КИО бурового оборудования',
      period: 'day',
      date_from: '2026-07-01',
      date_to: '2026-07-03'
    })

    expect(response.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          indicator: 'КИО бурового оборудования',
          gtk: 'Олимпиада',
          unit: '%'
        })
      ])
    )
    expect(response.details[0].points[0]).toEqual(
      expect.objectContaining({
        measure_unit: '%',
        fact: expect.any(Number),
        plan: expect.any(Number)
      })
    )
  })

  it('returns graph with details for the selected indicator and range', () => {
    const response = service.findGraphWithDetails({
      indicator: 'Горная масса',
      period: 'day',
      date_from: '2026-07-01',
      date_to: '2026-07-13'
    })

    expect(response.metadata).toEqual({
      period: 'day',
      production_date: '2026-07-13',
      start_date: '2026-07-01',
      end_date: '2026-07-13'
    })
    expect(response.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ indicator: 'Добыча руды', unit: 'тыс т' }),
        expect.objectContaining({ indicator: 'Содержание в руде', unit: 'т' }),
        expect.objectContaining({ indicator: 'Вскрыша', unit: 'тыс.м3' })
      ])
    )
    expect(response.details[0].points[0]).toEqual(
      expect.objectContaining({
        date: '2026-07-01',
        fact: expect.any(Number),
        plan: expect.any(Number),
        measure_unit: 'тыс т'
      })
    )
    expect(response.details[0].points.at(-1)?.date).toBe('2026-07-13')
  })

  it('returns different graph with details values for different gtk filters', () => {
    const olimpiadaResponse = service.findGraphWithDetails({
      indicator: 'Горная масса',
      gtk: 'Олимпиада',
      period: 'day',
      date_from: '2026-07-01',
      date_to: '2026-07-03'
    })
    const natalkaResponse = service.findGraphWithDetails({
      indicator: 'Горная масса',
      gtk: 'Наталка',
      period: 'day',
      date_from: '2026-07-01',
      date_to: '2026-07-03'
    })

    expect(olimpiadaResponse.details[0].points).not.toEqual(natalkaResponse.details[0].points)
  })

  it('returns monthly graph with details points when period is month', () => {
    const response = service.findGraphWithDetails({
      indicator: 'Горная масса',
      period: 'month',
      date_from: '2026-01-01',
      date_to: '2026-07-13'
    })

    expect(response.metadata.period).toBe('month')
    expect(response.details[0].points.map((point) => point.date)).toEqual([
      '2026-01-01',
      '2026-02-01',
      '2026-03-01',
      '2026-04-01',
      '2026-05-01',
      '2026-06-01',
      '2026-07-01'
    ])
  })

  it('returns an empty graph with details list for an unknown indicator', () => {
    const response = service.findGraphWithDetails({
      indicator: 'Неизвестный показатель',
      period: 'day',
      date_from: '2026-07-01',
      date_to: '2026-07-13'
    })

    expect(response.metadata).toEqual({
      period: 'day',
      production_date: '2026-07-13',
      start_date: '2026-07-01',
      end_date: '2026-07-13'
    })
    expect(response.details).toEqual([])
  })

  it('aggregates graph points by month', () => {
    const points = service.findGraph({
      period: 'month',
      date_from: '2024-01-01',
      date_to: '2024-02-29'
    })

    expect(points).toEqual([
      { date: '2024-01-01', fact: 3404, measure_unit: 'тыс. м3', plan: 3367 },
      { date: '2024-02-01', fact: 3211, measure_unit: 'тыс. м3', plan: 3148 }
    ])
  })

  it('aggregates graph points by year', () => {
    const points = service.findGraph({
      period: 'year',
      date_from: '2024-01-01',
      date_to: '2024-12-31'
    })

    expect(points).toEqual([
      { date: '2024-01-01', fact: 40599, measure_unit: 'тыс. м3', plan: 39852 }
    ])
  })

  it('uses default graph ranges by period when dates are not provided', () => {
    const today = new Date()
    const currentMonthStart = formatDate(
      new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1))
    )
    const currentYearStart = formatDate(new Date(Date.UTC(today.getFullYear(), 0, 1)))

    const dayPoints = service.findGraph({ period: 'day' })
    const monthPoints = service.findGraph({ period: 'month' })
    const yearPoints = service.findGraph({ period: 'year' })

    expect(dayPoints[0]?.date).toBe(currentMonthStart)
    expect(monthPoints[0]?.date).toBe(currentYearStart)
    expect(yearPoints[0]?.date).toBe('2024-01-01')
  })
})
