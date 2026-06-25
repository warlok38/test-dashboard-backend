import { ApiProperty } from '@nestjs/swagger'

export class BusinessUnitDto {
  @ApiProperty({ example: 'olimpiada' })
  value!: string

  @ApiProperty({ example: 'Олимпиада' })
  label!: string
}