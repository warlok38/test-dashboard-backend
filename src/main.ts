import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.enableCors({ origin: ['http://localhost:3000'] })

  const config = new DocumentBuilder()
    .setTitle('Test Dashboard API')
    .setDescription('Local API for the Polyus test dashboard')
    .setVersion('0.1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001)
}

void bootstrap()