import type { GraphPointDto } from '../dto/graph-point.dto'

export const GRAPH_DATA_START_DATE = '2024-01-01'
export const GRAPH_MEASURE_UNIT = 'тыс. м3'

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date)
  nextDate.setUTCDate(nextDate.getUTCDate() + days)

  return nextDate
}

function createGraphMock(): GraphPointDto[] {
  const startDate = new Date(`${GRAPH_DATA_START_DATE}T00:00:00.000Z`)
  const today = new Date()
  const endDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
  const points: GraphPointDto[] = []

  for (
    let date = startDate, dayIndex = 0;
    date <= endDate;
    date = addDays(date, 1), dayIndex += 1
  ) {
    points.push({
      date: formatDate(date),
      fact: 89 + ((dayIndex * 7) % 45),
      measure_unit: GRAPH_MEASURE_UNIT,
      plan: 92 + ((dayIndex * 6) % 35)
    })
  }

  return points
}

export const graphMock: GraphPointDto[] = createGraphMock()
