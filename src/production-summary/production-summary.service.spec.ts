import { ProductionSummaryService } from './production-summary.service'

describe('ProductionSummaryService', () => {
  let service: ProductionSummaryService

  beforeEach(() => {
    service = new ProductionSummaryService()
  })

  it('returns gtk names', () => {
    expect(service.findGtk()).toEqual(['Олимпиада', 'Наталка', 'Благодатное', 'Куранах', 'Сухой Лог'])
  })

  it('returns alarm summary', () => {
    const summary = service.findSummary()

    expect(summary.total_incidents).toBe(3)
    expect(summary.by_stage.mining.display_name).toBe('Добыча')
    expect(summary.by_enrichment.display_name).toBe('Обогащение')
  })

  it('returns graph points', () => {
    expect(service.findGraph()).toHaveLength(7)
  })
})
