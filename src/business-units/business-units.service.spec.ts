import { BusinessUnitsService } from './business-units.service'

describe('BusinessUnitsService', () => {
  it('returns all business units', () => {
    const service = new BusinessUnitsService()

    expect(service.findAll()).toEqual([
      { value: 'olimpiada', label: 'Олимпиада' },
      { value: 'blagodatnoe', label: 'Благодатное' },
      { value: 'natalka', label: 'Наталка' },
      { value: 'kuranah', label: 'Куранах' },
      { value: 'suhoy-log', label: 'Сухой Лог' }
    ])
  })
})
