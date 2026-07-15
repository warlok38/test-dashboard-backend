import type {
  GeneralSummaryCardDto,
  GeneralSummaryGtkDto,
  GeneralSummaryResponseDto
} from '../dto/general-summary-response.dto'

type GeneralSummaryPeriod = 'day' | 'week' | 'month' | 'year'

type GeneralSummarySeed = Omit<GeneralSummaryCardDto, 'cards' | 'details'> & {
  cards?: GeneralSummarySeed[]
  details?: GeneralSummaryGtkDto[]
}

const periodFactors: Record<GeneralSummaryPeriod, number> = {
  day: 1,
  week: 4.8,
  month: 18.5,
  year: 126.4
}

const periodDeviationShift: Record<GeneralSummaryPeriod, number> = {
  day: 0,
  week: 1.8,
  month: -2.4,
  year: 4.1
}

const rootSeed: GeneralSummarySeed = {
  indicator_name: 'Количество AU',
  plan_value: 234.12,
  fact_value: 146.14,
  deviation_pct: -46.27,
  measure_unit: 'кг',
  cards: [
    {
      indicator_name: 'Объем бурения',
      plan_value: 22.12,
      fact_value: 27.86,
      deviation_pct: 25.96,
      measure_unit: 'тыс. п.м.',
      details: [
        {
          gtk_or_zif: 'Олимпиада',
          plan_value: 7.18,
          fact_value: 8.72,
          deviation_pct: 21.45
        },
        {
          gtk_or_zif: 'Наталка',
          plan_value: 4.94,
          fact_value: 6.13,
          deviation_pct: 24.09
        },
        {
          gtk_or_zif: 'Благодатное',
          plan_value: 4.88,
          fact_value: 5.9,
          deviation_pct: 20.9
        },
        {
          gtk_or_zif: 'Куранах',
          plan_value: 3.14,
          fact_value: 4.18,
          deviation_pct: 33.12
        },
        {
          gtk_or_zif: 'Сухой Лог',
          plan_value: 1.98,
          fact_value: 2.93,
          deviation_pct: 47.98
        }
      ],
      cards: [
        {
          indicator_name: 'КИО бурового оборудования',
          plan_value: 55.8,
          fact_value: 62.9,
          deviation_pct: 7.11,
          measure_unit: '%'
        },
        {
          indicator_name: 'КТГ бурового оборудования',
          plan_value: 55.8,
          fact_value: 84.5,
          deviation_pct: 7.11,
          measure_unit: '%'
        },
        {
          indicator_name: 'Выход взорванной ГМ с 1 п.м',
          plan_value: 33.28,
          fact_value: 0,
          deviation_pct: -100,
          measure_unit: 'м3/п.м.'
        }
      ]
    },
    {
      indicator_name: 'Горная масса',
      plan_value: 657.55,
      fact_value: 674.99,
      deviation_pct: 2.65,
      measure_unit: 'тыс. м3',
      details: [
        {
          gtk_or_zif: 'Олимпиада',
          plan_value: 218.52,
          fact_value: 224.18,
          deviation_pct: 2.59
        },
        {
          gtk_or_zif: 'Наталка',
          plan_value: 142.26,
          fact_value: 151.34,
          deviation_pct: 6.38
        },
        {
          gtk_or_zif: 'Благодатное',
          plan_value: 124.68,
          fact_value: 129.52,
          deviation_pct: 3.88
        },
        {
          gtk_or_zif: 'Куранах',
          plan_value: 96.44,
          fact_value: 92.11,
          deviation_pct: -4.49
        },
        {
          gtk_or_zif: 'Сухой Лог',
          plan_value: 75.65,
          fact_value: 77.84,
          deviation_pct: 2.89
        }
      ],
      cards: [
        {
          indicator_name: 'Добыча руды',
          plan_value: 191.9,
          fact_value: 180.42,
          deviation_pct: -5.98,
          measure_unit: 'тыс. т'
        },
        {
          indicator_name: 'Содержание в руде',
          plan_value: 1.22,
          fact_value: 0.81,
          deviation_pct: -33.39,
          measure_unit: 'г/т'
        },
        {
          indicator_name: 'Вскрыша',
          plan_value: 571.02,
          fact_value: 567.35,
          deviation_pct: -0.64,
          measure_unit: 'тыс. м3'
        }
      ]
    },
    {
      indicator_name: 'Грузооборот',
      plan_value: 8172,
      fact_value: 8288,
      deviation_pct: 1.42,
      measure_unit: 'тыс. ткм',
      cards: [
        {
          indicator_name: 'КИО Самосвалов',
          plan_value: 75.2,
          fact_value: 74.2,
          deviation_pct: -1.03,
          measure_unit: '%'
        },
        {
          indicator_name: 'КТГ Самосвалов',
          plan_value: 84.6,
          fact_value: 84.3,
          deviation_pct: -0.33,
          measure_unit: '%'
        },
        {
          indicator_name: 'Плечо',
          plan_value: 10,
          fact_value: 0,
          deviation_pct: -100,
          measure_unit: 'км'
        }
      ]
    },
    {
      indicator_name: 'Выпуск',
      plan_value: 199.56,
      fact_value: 172.45,
      deviation_pct: -13.6,
      measure_unit: 'кг',
      cards: [
        {
          indicator_name: 'Переработка',
          plan_value: 166.75,
          fact_value: 189.4,
          deviation_pct: 13.6,
          measure_unit: 'тыс. т'
        },
        {
          indicator_name: 'Содержание Au',
          plan_value: 13.93,
          fact_value: 9.64,
          deviation_pct: -36.4,
          measure_unit: 'г/т'
        },
        {
          indicator_name: 'Извлечение',
          plan_value: 593.74,
          fact_value: 518.76,
          deviation_pct: -13.48,
          measure_unit: '%'
        }
      ]
    }
  ]
}

function roundValue(value: number, fractionDigits = 2): number {
  return Number(value.toFixed(fractionDigits))
}

function scaleGtkBreakdown(
  breakdown: GeneralSummaryGtkDto,
  shouldScale: boolean,
  factor: number,
  deviationShift: number
): GeneralSummaryGtkDto {
  const deviationSign = breakdown.deviation_pct < 0 ? -1 : 1

  return {
    gtk_or_zif: breakdown.gtk_or_zif,
    fact_value: shouldScale
      ? roundValue(breakdown.fact_value * factor)
      : roundValue(breakdown.fact_value),
    plan_value: shouldScale
      ? roundValue(breakdown.plan_value * factor)
      : roundValue(breakdown.plan_value),
    deviation_pct: roundValue(breakdown.deviation_pct + deviationSign * deviationShift)
  }
}

function scaleCard(
  card: GeneralSummarySeed,
  factor: number,
  deviationShift: number
): GeneralSummaryCardDto {
  const shouldScale =
    card.measure_unit !== '%' && card.measure_unit !== 'г/т' && card.measure_unit !== 'км'
  const factValue = shouldScale ? roundValue(card.fact_value * factor) : roundValue(card.fact_value)
  const planValue = shouldScale ? roundValue(card.plan_value * factor) : roundValue(card.plan_value)
  const deviationSign = card.deviation_pct < 0 ? -1 : 1
  const deviationValue =
    card.deviation_pct === -100 ? -100 : card.deviation_pct + deviationSign * deviationShift

  return {
    indicator_name: card.indicator_name,
    plan_value: planValue,
    fact_value: factValue,
    deviation_pct: roundValue(deviationValue),
    measure_unit: card.measure_unit,
    details:
      card.details?.map((breakdown) =>
        scaleGtkBreakdown(breakdown, shouldScale, factor, deviationShift)
      ) ?? null,
    cards: card.cards?.map((child) => scaleCard(child, factor, deviationShift)) ?? null
  }
}

function createGeneralSummaryMock(period: GeneralSummaryPeriod): GeneralSummaryResponseDto {
  return {
    production_date_from: '2026-06-26',
    production_date_to: '2026-06-26',
    shift: 3,
    cards: [scaleCard(rootSeed, periodFactors[period], periodDeviationShift[period])]
  }
}

export const generalSummaryMocks: Record<GeneralSummaryPeriod, GeneralSummaryResponseDto> = {
  day: createGeneralSummaryMock('day'),
  week: createGeneralSummaryMock('week'),
  month: createGeneralSummaryMock('month'),
  year: createGeneralSummaryMock('year')
}

export const generalSummaryMock = generalSummaryMocks.day
