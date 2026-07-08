import { Test } from '@nestjs/testing'

import { AuthModule } from './auth.module'

describe('AuthModule', () => {
  it('compiles with default providers', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule]
    }).compile()

    expect(moduleRef).toBeDefined()
  })
})
