import { ApiProperty } from '@nestjs/swagger'

export class AuthResponseDto {
  @ApiProperty({ example: 'mock-access-token' })
  token!: string

  @ApiProperty({ example: 'Товарищ Разработчик' })
  name!: string

  @ApiProperty({ nullable: true, example: null })
  avatar!: string | null
}
