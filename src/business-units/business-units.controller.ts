import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { BusinessUnitsService } from './business-units.service'
import { BusinessUnitDto } from './dto/business-unit.dto'

@ApiTags('business-units')
@Controller('business-units')
export class BusinessUnitsController {
  constructor(private readonly businessUnitsService: BusinessUnitsService) {}

  @Get()
  @ApiOkResponse({ type: BusinessUnitDto, isArray: true })
  findAll(): BusinessUnitDto[] {
    return this.businessUnitsService.findAll()
  }
}