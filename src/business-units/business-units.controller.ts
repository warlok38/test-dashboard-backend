import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { AuthGuard } from '../auth/auth.guard'
import { BusinessUnitsService } from './business-units.service'
import { BusinessUnitDto } from './dto/business-unit.dto'

@ApiTags('business-units')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('business-units')
export class BusinessUnitsController {
  constructor(private readonly businessUnitsService: BusinessUnitsService) {}

  @Get()
  @ApiOkResponse({ type: BusinessUnitDto, isArray: true })
  findAll(): BusinessUnitDto[] {
    return this.businessUnitsService.findAll()
  }
}
