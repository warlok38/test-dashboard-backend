import { Test } from '@nestjs/testing'

import { ProductionSummaryModule } from './production-summary.module'

describe('ProductionSummaryModule', () => {
  it('compiles with auth dependencies', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProductionSummaryModule]
    }).compile()

    expect(moduleRef).toBeDefined()
  })
})
