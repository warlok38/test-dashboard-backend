import { Injectable } from '@nestjs/common'

import { businessUnits } from './data/business-units.data'
import { BusinessUnitDto } from './dto/business-unit.dto'

@Injectable()
export class BusinessUnitsService {
  findAll(): BusinessUnitDto[] {
    return businessUnits
  }
}