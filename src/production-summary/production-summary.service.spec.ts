import { ProductionSummaryService } from './production-summary.service'

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
    expect(summary.by_enrichment.display_name).toBe('Обогащение')
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
