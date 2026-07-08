import { Injectable } from '@nestjs/common'

import { summaryMock } from './data/summary.data'
import { graphMock } from './data/graph.data'
import type { AlarmSummaryResponseDto } from './dto/alarm-summary-response.dto'
import type { GraphPointDto } from './dto/graph-point.dto'

const gtkNames = ['Олимпиада', 'Наталка', 'Благодатное', 'Куранах', 'Сухой Лог']

@Injectable()
export class ProductionSummaryService {
  findGtk(): string[] {
    return gtkNames
  }

  findSummary(): AlarmSummaryResponseDto {
    return summaryMock
  }

  findGraph(): GraphPointDto[] {
    return graphMock
  }
}
