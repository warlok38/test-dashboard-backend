import { NotFoundException } from '@nestjs/common'

import { ProductionStagesService } from './production-stages.service'

describe('ProductionStagesService', () => {
  let service: ProductionStagesService

  beforeEach(() => {
    service = new ProductionStagesService()
  })

  it('returns production stages summary', () => {
    const stages = service.findAll()

    expect(stages).toHaveLength(5)
    expect(stages[0]).toMatchObject({
      id: 'mining',
      title: 'Добыча',
      detailRoute: '/production-stages/mining',
      plan: { completed: 2, total: 4 }
    })
  })

  it('aggregates production stages summary for selected business units', () => {
    const stages = service.findAll({ businessUnit: ['olimpiada', 'blagodatnoe'] })
    const mining = stages.find((stage) => stage.id === 'mining')
    const rockMass = mining?.metrics.find((metric) => metric.id === 'mining-rock-mass')

    expect(rockMass).toMatchObject({
      value: 374.16,
      plan: 356.47,
      delta: 5,
      status: 'success'
    })
  })

  it('returns mining metrics', () => {
    const metrics = service.findStageMetrics('mining')

    expect(metrics).toHaveLength(4)
    expect(metrics.map((metric) => metric.id)).toEqual([
      'rock-mass',
      'ore',
      'au-content',
      'overburden'
    ])
  })

  it('aggregates mining metrics for a selected business unit', () => {
    const metrics = service.findStageMetrics('mining', { businessUnit: 'blagodatnoe' })
    const rockMass = metrics.find((metric) => metric.id === 'rock-mass')

    expect(rockMass?.summary).toEqual({ fact: 114.97, plan: 114.25 })
    expect(rockMass?.data[0]).toEqual({ day: '10', month: 'Май', fact: 61.82, plan: 58.59 })
  })

  it('returns mining rock mass metric detail', () => {
    const detail = service.findMetricDetail('mining', 'rock-mass')

    expect(detail).toMatchObject({
      stageSlug: 'mining',
      stageTitle: 'Добыча',
      metricSlug: 'rock-mass',
      metricTitle: 'Горная масса',
      unit: 'тыс. м3'
    })
    expect(detail.summaries).toHaveLength(5)
    expect(detail.trend).toHaveLength(30)
  })

  it('filters metric detail summaries and aggregates trend for selected business units', () => {
    const detail = service.findMetricDetail('mining', 'rock-mass', {
      businessUnit: ['olimpiada', 'blagodatnoe']
    })

    expect(detail.summaries.map((summary) => summary.slug)).toEqual(['olimpiada', 'blagodatnoe'])
    expect(detail.trend[0]).toEqual({ day: '10', month: 'Май', fact: 201.2, plan: 182.81 })
  })

  it('creates a comment for a known metric', () => {
    const comment = service.createMetricComment('mining', 'rock-mass', {
      author: 'Оператор',
      text: 'Причина отклонения: простой техники на участке.'
    })

    expect(comment).toMatchObject({
      id: 'comment-1',
      stageSlug: 'mining',
      metricSlug: 'rock-mass',
      author: 'Оператор',
      text: 'Причина отклонения: простой техники на участке.'
    })
    expect(new Date(comment.createdAt).toString()).not.toBe('Invalid Date')
  })

  it('throws not found when creating a comment for unknown metric detail', () => {
    expect(() =>
      service.createMetricComment('mining', 'unknown', {
        author: 'Оператор',
        text: 'Комментарий'
      })
    ).toThrow(NotFoundException)
  })

  it('throws not found for unknown stage metrics', () => {
    expect(() => service.findStageMetrics('unknown')).toThrow(NotFoundException)
  })

  it('throws not found for unknown metric detail', () => {
    expect(() => service.findMetricDetail('mining', 'unknown')).toThrow(NotFoundException)
  })
})
